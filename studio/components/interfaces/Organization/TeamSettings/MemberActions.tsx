import { FC, useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import * as Tooltip from '@radix-ui/react-tooltip'
import { PermissionAction } from '@supabase/shared-types/out/constants'
import { Button, Dropdown, IconTrash, IconMoreHorizontal } from 'ui'

import { Member, Role } from 'types'
import { useStore, useOrganizationDetail, useFlag, checkPermissions } from 'hooks'
import { delete_, post } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import TextConfirmModal from 'components/ui/Modals/TextConfirmModal'
import { confirmAlert } from 'components/to-be-cleaned/ModalsDeprecated/ConfirmModal'

import { PageContext } from 'pages/org/[slug]/settings'
import { getUserDisplayName, isInviteExpired } from '../Organization.utils'
import { getRolesManagementPermissions } from './TeamSettings.utils'

interface Props {
  members: Member[]
  member: Member
  roles: Role[]
}

const MemberActions: FC<Props> = ({ members, member, roles }) => {
  const PageState: any = useContext(PageContext)
  const { id, slug, name: orgName } = PageState.organization
  const { rolesRemovable } = getRolesManagementPermissions(roles)

  const { app, ui } = useStore()
  const enablePermissions = useFlag('enablePermissions')
  const { mutateOrgMembers } = useOrganizationDetail(ui.selectedOrganization?.slug || '')

  const [loading, setLoading] = useState(false)
  const [ownerTransferIsVisible, setOwnerTransferIsVisible] = useState(false)

  const isExpired = isInviteExpired(member?.invited_at ?? '')
  const isPendingInviteAcceptance = member.invited_id

  const roleId = member.role_ids?.[0] ?? -1
  const canRemoveMember = enablePermissions
    ? rolesRemovable.includes((member?.role_ids ?? [-1])[0])
    : true
  const canResendInvite = checkPermissions(PermissionAction.CREATE, 'user_invites', {
    resource: { role_id: roleId },
  })
  const canRevokeInvite = checkPermissions(PermissionAction.DELETE, 'user_invites', {
    resource: { role_id: roleId },
  })

  const handleMemberDelete = async () => {
    confirmAlert({
      title: '确认删除',
      message: `这是永久性的！是否确实要删除${member.primary_email}`,
      onAsyncConfirm: async () => {
        setLoading(true)

        const response = enablePermissions
          ? await delete_(`${API_URL}/organizations/${slug}/members/${member.gotrue_id}`)
          : await delete_(`${API_URL}/organizations/${slug}/members/remove`, {
              member_id: member.id,
            })

        if (response.error) {
          ui.setNotification({
            category: 'error',
            message: `删除用户失败：${response.error.message}`,
          })
          setLoading(false)
        } else {
          const updatedMembers = enablePermissions
            ? members.filter((m) => m.gotrue_id !== member.gotrue_id)
            : members.filter((m) => m.id !== member.id)

          mutateOrgMembers(updatedMembers)
          ui.setNotification({
            category: 'success',
            message: `已成功删除${member.primary_email}`,
          })
        }
      },
    })
  }

  // [Joshen] This will be deprecated after ABAC is fully rolled out
  const handleTransferOwnership = async () => {
    setLoading(true)

    const response = await post(`${API_URL}/organizations/${slug}/transfer`, {
      org_id: id,
      member_id: member.id,
    })
    if (response.error) {
      ui.setNotification({
        category: 'error',
        message: `转让所有权失败：${response.error.message}`,
      })
      setLoading(false)
    } else {
      const updatedMembers = members.map((m: any) => {
        if (m.is_owner) return { ...m, is_owner: false }
        if (m.id === member.id) return { ...m, is_owner: true }
        else return { ...m }
      })

      mutateOrgMembers(updatedMembers)
      setOwnerTransferIsVisible(false)
      ui.setNotification({ category: 'success', message: '成功转移组织' })
    }

    app.organizations.load()
  }

  async function handleResendInvite(member: Member) {
    setLoading(true)

    const roleId = (member?.role_ids ?? [])[0]
    const response = await post(`${API_URL}/organizations/${slug}/members/invite`, {
      invited_email: member.primary_email,
      owner_id: member.invited_id,
      ...(enablePermissions ? { role_id: roleId } : {}),
    })

    if (response.error) {
      ui.setNotification({
        category: 'error',
        message: `无法重新发送邀请：${response.error.message}`,
      })
    } else {
      const updatedMembers = [...members]
      mutateOrgMembers(updatedMembers)
      ui.setNotification({ category: 'success', message: '重新发送了邀请。' })
    }
    setLoading(false)
  }

  async function handleRevokeInvitation(member: Member) {
    setLoading(true)

    const invitedId = member.invited_id
    if (!invitedId) return

    const response = await delete_(
      `${API_URL}/organizations/${slug}/members/invite?invited_id=${invitedId}`,
      {}
    )

    if (response.error) {
      ui.setNotification({
        category: 'error',
        message: `无法撤销邀请：${response.error.message}`,
      })
    } else {
      const updatedMembers = [...members]
      mutateOrgMembers(updatedMembers)
      ui.setNotification({ category: 'success', message: '已成功撤销邀请。' })
    }
    setLoading(false)
  }

  if (!canRemoveMember || (isPendingInviteAcceptance && !canResendInvite && !canRevokeInvite)) {
    return (
      <div className="flex items-center justify-end">
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger>
            <Button as="span" type="text" icon={<IconMoreHorizontal />} />
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom">
            <Tooltip.Arrow className="radix-tooltip-arrow" />
            <div
              className={[
                'rounded bg-scale-100 py-1 px-2 leading-none shadow', // background
                'border border-scale-200 ', //border
              ].join(' ')}
            >
              <span className="text-xs text-scale-1200">
                您需要其他权限才能管理此团队成员
              </span>
            </div>
          </Tooltip.Content>
        </Tooltip.Root>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end">
      <Dropdown
        side="bottom"
        align="end"
        overlay={
          <>
            {!enablePermissions && !isPendingInviteAcceptance && (
              <>
                <Dropdown.Item onClick={() => setOwnerTransferIsVisible(!ownerTransferIsVisible)}>
                  <div className="flex flex-col">
                    <p>成为所有者</p>
                    <p className="block opacity-50">转让"{orgName}"的所有权</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Separator />
              </>
            )}
            {isPendingInviteAcceptance ? (
              <>
                {canRevokeInvite && (
                  <Dropdown.Item onClick={() => handleRevokeInvitation(member)}>
                    <div className="flex flex-col">
                      <p>取消邀请</p>
                      <p className="block opacity-50">撤销此邀请。</p>
                    </div>
                  </Dropdown.Item>
                )}
                {canResendInvite && isExpired && (
                  <>
                    <Dropdown.Separator />
                    <Dropdown.Item onClick={() => handleResendInvite(member)}>
                      <div className="flex flex-col">
                        <p>重新发送邀请</p>
                        <p className="block opacity-50">邀请将在 24 小时后过期。</p>
                      </div>
                    </Dropdown.Item>
                  </>
                )}
              </>
            ) : (
              <Dropdown.Item icon={<IconTrash size={16} />} onClick={handleMemberDelete}>
                <p>删除成员</p>
              </Dropdown.Item>
            )}
          </>
        }
      >
        <Button
          as="span"
          type="text"
          disabled={loading}
          loading={loading}
          icon={<IconMoreHorizontal />}
        />
      </Dropdown>

      <TextConfirmModal
        title="转移组织"
        visible={ownerTransferIsVisible}
        confirmString={slug}
        loading={loading}
        confirmLabel="我明白，转让所有权"
        confirmPlaceholder="输入组织名称"
        onCancel={() => setOwnerTransferIsVisible(!ownerTransferIsVisible)}
        onConfirm={handleTransferOwnership}
        alert="信用卡等付款方式也将转移。您可能需要先删除信用卡信息，然后再转移。"
        text={
          <span>
            通过转让此组织，它将完全归属{' '}
            <span className="font-medium dark:text-white">{getUserDisplayName(member)}</span>，他们还可以将您从组织中删除成员身份
          </span>
        }
      />
    </div>
  )
}

export default observer(MemberActions)
