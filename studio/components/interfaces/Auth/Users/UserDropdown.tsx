import { FC, useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Button, Dropdown, Divider, IconTrash, IconMail, IconMoreHorizontal } from 'ui'

import { useStore } from 'hooks'
import { timeout } from 'lib/helpers'
import { post, delete_ } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { PageContext } from 'pages/project/[ref]/auth/users'
import { confirmAlert } from 'components/to-be-cleaned/ModalsDeprecated/ConfirmModal'
import { User } from './Users.types'

interface Props {
  user: User
  canRemoveUser: boolean
}

const UserDropdown: FC<Props> = ({ user, canRemoveUser }) => {
  const PageState: any = useContext(PageContext)
  const { ui } = useStore()
  const [loading, setLoading] = useState<boolean>(false)

  async function handleResetPassword() {
    try {
      setLoading(true)
      const response = await post(`${API_URL}/auth/${PageState.projectRef}/recover`, user)
      if (response.error) {
        ui.setNotification({
          category: 'error',
          message: `无法发送密码恢复邮件：${response.error.message}`,
        })
      } else {
        ui.setNotification({
          category: 'success',
          message: `已将密码恢复邮件发送到${user.email}`,
        })
      }
    } catch (error: any) {
      ui.setNotification({
        category: 'error',
        message: `发送密码恢复邮件失败：${error?.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSendMagicLink() {
    try {
      setLoading(true)
      const response = await post(`${API_URL}/auth/${PageState.projectRef}/magiclink`, user)
      if (response.error) {
        ui.setNotification({
          category: 'error',
          message: `无法发送魔术链接：${response.error.message}`,
        })
      } else {
        ui.setNotification({
          category: 'success',
          message: `已发送魔术链接给${user.email}`,
        })
      }
    } catch (error: any) {
      ui.setNotification({
        category: 'error',
        message: `无法发送魔术链接: ${error?.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSendOtp() {
    try {
      setLoading(true)
      const response = await post(`${API_URL}/auth/${PageState.projectRef}/otp`, user)
      if (response.error) {
        ui.setNotification({
          category: 'error',
          message: `发送OTP失败: ${response.error.message}`,
        })
      } else {
        ui.setNotification({
          category: 'success',
          message: `向${user.phone}发送OTP `,
        })
      }
    } catch (error: any) {
      ui.setNotification({
        category: 'error',
        message: `发送OTP失败: ${error?.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    await timeout(200)

    confirmAlert({
      title: '确认删除',
      message: `这是永久性的！是否确定要删除用户${user.email} ?`,
      onAsyncConfirm: async () => {
        setLoading(true)
        const response = await delete_(`${API_URL}/auth/${PageState.projectRef}/users`, user)
        if (response.error) {
          ui.setNotification({
            category: 'error',
            message: `删除用户失败：${response.error.message}`,
          })
        } else {
          ui.setNotification({ category: 'success', message: `已成功删除${user.email}` })
          PageState.users = PageState.users.filter((x: any) => x.id != user.id)
          PageState.totalUsers -= 1
        }
        setLoading(false)
      },
    })
  }

  return (
    <Dropdown
      size="medium"
      overlay={
        <>
          {user.email !== null ? (
            <>
              <Dropdown.Item onClick={handleResetPassword} icon={<IconMail size="tiny" />}>
                发送密码恢复邮件
              </Dropdown.Item>
              <Dropdown.Item onClick={handleSendMagicLink} icon={<IconMail size="tiny" />}>
                发送魔法链接
              </Dropdown.Item>
            </>
          ) : null}
          {user.phone !== null ? (
            <Dropdown.Item onClick={handleSendOtp} icon={<IconMail size="tiny" />}>
              发送一次性密码（OTP）
            </Dropdown.Item>
          ) : null}
          <Dropdown.Separator />
          <Tooltip.Root delayDuration={0}>
            <Tooltip.Trigger className="w-full">
              <Dropdown.Item
                onClick={handleDelete}
                icon={<IconTrash size="tiny" />}
                disabled={!canRemoveUser}
              >
                删除用户
              </Dropdown.Item>
            </Tooltip.Trigger>
            {!canRemoveUser && (
              <Tooltip.Content side="bottom">
                <Tooltip.Arrow className="radix-tooltip-arrow" />
                <div
                  className={[
                    'rounded bg-scale-100 py-1 px-2 leading-none shadow',
                    'border border-scale-200',
                  ].join(' ')}
                >
                  <span className="text-xs text-scale-1200">
                    您需要额外的权限才能删除用户
                  </span>
                </div>
              </Tooltip.Content>
            )}
          </Tooltip.Root>
        </>
      }
    >
      <Button
        as="span"
        type="text"
        icon={<IconMoreHorizontal />}
        loading={loading}
        className="hover:border-gray-500"
      />
    </Dropdown>
  )
}

export default observer(UserDropdown)
