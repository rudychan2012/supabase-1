import { FC, useState } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Modal, Button, IconPauseCircle } from 'ui'
import { PermissionAction } from '@supabase/shared-types/out/constants'

import { Project } from 'types'
import { checkPermissions, useStore, useFlag, useFreeProjectLimitCheck } from 'hooks'
import { post } from 'lib/common/fetch'
import { API_URL, PROJECT_STATUS } from 'lib/constants'
import { DeleteProjectButton } from 'components/interfaces/Settings/General'
import ConfirmModal from 'components/ui/Dialogs/ConfirmDialog'

interface Props {
  project: Project
}

const ProjectPausedState: FC<Props> = ({ project }) => {
  const { ui, app } = useStore()
  const isOwner = ui.selectedOrganization?.is_owner
  const orgSlug = ui.selectedOrganization?.slug

  const kpsEnabled = useFlag('initWithKps')
  const enablePermissions = useFlag('enablePermissions')

  const [showConfirmRestore, setShowConfirmRestore] = useState(false)
  const [showFreeProjectLimitWarning, setShowFreeProjectLimitWarning] = useState(false)

  const { membersExceededLimit } = useFreeProjectLimitCheck(orgSlug)
  const hasMembersExceedingFreeTierLimit = (membersExceededLimit || []).length > 0

  const canResumeProject = enablePermissions
    ? checkPermissions(PermissionAction.INFRA_EXECUTE, 'queue_jobs.projects.initialize_or_resume')
    : isOwner

  const onSelectRestore = () => {
    if (!canResumeProject) {
      ui.setNotification({
        category: 'error',
        message: 'You do not have the required permissions to restore this project',
      })
    } else if (hasMembersExceedingFreeTierLimit) setShowFreeProjectLimitWarning(true)
    else setShowConfirmRestore(true)
  }

  const onConfirmRestore = async () => {
    await post(`${API_URL}/projects/${project.ref}/restore`, { kps_enabled: kpsEnabled })
    app.onProjectUpdated({ ...project, status: PROJECT_STATUS.RESTORING })
    ui.setNotification({ category: 'success', message: 'Restoring project' })
  }

  return (
    <>
      <div className="space-y-4">
        <div className="mx-auto mb-16 w-full max-w-7xl">
          <div className="mx-6 flex h-[500px] items-center justify-center rounded border border-scale-400 bg-scale-300 p-8">
            <div className="grid w-[420px] gap-4">
              <div className="mx-auto flex max-w-[300px] items-center justify-center space-x-4 lg:space-x-8">
                <IconPauseCircle className="text-scale-1100" size={50} strokeWidth={1.5} />
              </div>

              <p className="text-center">该项目已暂停。</p>

              <div className="flex items-center justify-center gap-4">
                <Tooltip.Root delayDuration={0}>
                  <Tooltip.Trigger>
                    <Button
                      size="tiny"
                      type="primary"
                      disabled={!canResumeProject}
                      onClick={onSelectRestore}
                    >
                      恢复项目
                    </Button>
                  </Tooltip.Trigger>
                  {!canResumeProject && (
                    <Tooltip.Content side="bottom">
                      <Tooltip.Arrow className="radix-tooltip-arrow" />
                      <div
                        className={[
                          'rounded bg-scale-100 py-1 px-2 leading-none shadow', // background
                          'border border-scale-200 ', //border
                        ].join(' ')}
                      >
                        <span className="text-xs text-scale-1200">
                          您需要额外的权限才能恢复此项目
                        </span>
                      </div>
                    </Tooltip.Content>
                  )}
                </Tooltip.Root>
                <DeleteProjectButton type="default" />
              </div>

              <p className="mt-4 text-sm text-scale-1000">
                恢复此项目并重新开始构建下一件大事！
              </p>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        visible={showConfirmRestore}
        title="恢复这个项目"
        description="确认恢复该项目？您的项目数据将恢复到最初暂停时的状态。"
        buttonLabel="恢复项目"
        buttonLoadingLabel="恢复项目"
        onSelectCancel={() => setShowConfirmRestore(false)}
        onSelectConfirm={onConfirmRestore}
      />
      <Modal
        hideFooter
        visible={showFreeProjectLimitWarning}
        size="medium"
        header="您的组织有超出免费项目限制的成员"
        onCancel={() => setShowFreeProjectLimitWarning(false)}
      >
        <div className="space-y-4 py-4">
          <Modal.Content>
            <div className="space-y-2">
              <p className="text-sm text-scale-1100">
                以下成员已达到其作为管理员或所有者的组织内活动免费层项目数量的最大限制：
              </p>
              <ul className="list-disc pl-5 text-sm text-scale-1100">
                {(membersExceededLimit || []).map((member, idx: number) => (
                  <li key={`member-${idx}`}>
                    {member.username || member.primary_email} (Limit: {member.free_project_limit}{' '}
                    免费项目)
                  </li>
                ))}
              </ul>
              <p className="text-sm text-scale-1100">
                这些成员需要先删除、暂停或升级其中一个或多个项目，然后您才能取消暂停该项目。
              </p>
            </div>
          </Modal.Content>
          <Modal.Separator />
          <Modal.Content>
            <div className="flex items-center gap-2">
              <Button
                htmlType="button"
                type="default"
                onClick={() => setShowFreeProjectLimitWarning(false)}
                block
              >
                明白了
              </Button>
            </div>
          </Modal.Content>
        </div>
      </Modal>
    </>
  )
}

export default ProjectPausedState
