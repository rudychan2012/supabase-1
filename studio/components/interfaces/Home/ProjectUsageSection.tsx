import { FC } from 'react'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import { IconLoader, IconAlertCircle } from 'ui'

import { useProjectUsage } from 'hooks'
import { ProjectUsage, NewProjectPanel } from 'components/interfaces/Home'
import InformationBox from 'components/ui/InformationBox'

const ProjectUsageSection: FC = observer(({}) => {
  const router = useRouter()
  const { ref } = router.query
  const { usage, error: usageError, isLoading } = useProjectUsage(ref as string)

  if (usageError) {
    return (
      <InformationBox
        hideCollapse
        defaultVisibility
        icon={<IconAlertCircle strokeWidth={2} />}
        title="加载项目的使用详情时出现问题"
      />
    )
  }

  const hasProjectData = usage
    ? Object.keys(usage)
        .map((key) => usage[key].usage)
        .some((usage) => usage > 0)
    : false

  return (
    <>
      {isLoading ? (
        <div className="flex w-full items-center justify-center space-x-2">
          <IconLoader className="animate-spin" size={14} />
          <p className="text-sm">检索项目使用统计信息</p>
        </div>
      ) : hasProjectData ? (
        <ProjectUsage />
      ) : (
        <NewProjectPanel />
      )}
    </>
  )
})
export default ProjectUsageSection
