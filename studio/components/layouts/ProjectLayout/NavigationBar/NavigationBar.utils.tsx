import {
  IconArchive,
  IconBarChart,
  IconCode,
  IconDatabase,
  IconFileText,
  IconList,
  IconSettings,
  IconUsers,
} from 'ui'
import SVG from 'react-inlinesvg'

import { ProjectBase } from 'types'
import { Route } from 'components/ui/ui.types'
import { IS_PLATFORM, PROJECT_STATUS } from 'lib/constants'

export const generateToolRoutes = (ref?: string, project?: ProjectBase): Route[] => {
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const isProjectPaused = project?.status === PROJECT_STATUS.INACTIVE

  const homeUrl = `/project/${ref}`
  const buildingUrl = `/project/${ref}/building`

  return [
    {
      key: 'editor',
      label: '表编辑器',
      icon: (
        <SVG
          src="/img/table-editor.svg"
          style={{ width: `${18}px`, height: `${18}px` }}
          preProcessor={(code) => code.replace(/svg/, 'svg class="m-auto text-color-inherit"')}
        />
      ),
      link:
        ref &&
        (isProjectPaused ? homeUrl : isProjectBuilding ? buildingUrl : `/project/${ref}/editor`),
    },
    {
      key: 'sql',
      label: 'SQL执行器',
      icon: (
        <SVG
          src="/img/sql-editor.svg"
          style={{ width: `${18}px`, height: `${18}px` }}
          preProcessor={(code) => code.replace(/svg/, 'svg class="m-auto text-color-inherit"')}
        />
      ),
      link:
        ref &&
        (isProjectPaused ? homeUrl : isProjectBuilding ? buildingUrl : `/project/${ref}/sql`),
    },
  ]
}
export const generateProductRoutes = (ref?: string, project?: ProjectBase): Route[] => {
  const isProjectBuilding = project?.status !== PROJECT_STATUS.ACTIVE_HEALTHY
  const isProjectPaused = project?.status === PROJECT_STATUS.INACTIVE

  const homeUrl = `/project/${ref}`
  const buildingUrl = `/project/${ref}/building`

  return [
    {
      key: 'database',
      label: '数据库',
      icon: <IconDatabase size={18} strokeWidth={2} />,
      link:
        ref &&
        (isProjectPaused
          ? homeUrl
          : isProjectBuilding
          ? buildingUrl
          : `/project/${ref}/database/tables`),
    },
    {
      key: 'auth',
      label: '用户认证',
      icon: <IconUsers size={18} strokeWidth={2} />,
      link:
        ref &&
        (isProjectPaused
          ? homeUrl
          : isProjectBuilding
          ? buildingUrl
          : `/project/${ref}/auth/users`),
    },
    {
      key: 'storage',
      label: '存储',
      icon: <IconArchive size={18} strokeWidth={2} />,
      link:
        ref &&
        (isProjectPaused
          ? homeUrl
          : isProjectBuilding
          ? buildingUrl
          : `/project/${ref}/storage/buckets`),
    },
    // ...(IS_PLATFORM
    //   ? [
    //       {
    //         key: 'functions',
    //         label: 'Edge Functions',
    //         icon: <IconCode size={18} strokeWidth={2} />,
    //         link:
    //           ref &&
    //           (isProjectPaused
    //             ? homeUrl
    //             : isProjectBuilding
    //             ? buildingUrl
    //             : `/project/${ref}/functions`),
    //       },
    //     ]
    //   : []),
  ]
}

export const generateOtherRoutes = (ref?: string, project?: ProjectBase): Route[] => {
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const isProjectPaused = project?.status === PROJECT_STATUS.INACTIVE

  const homeUrl = `/project/${ref}`
  const buildingUrl = `/project/${ref}/building`

  return [
    // ...(IS_PLATFORM
    //   ? [
    //       {
    //         key: 'reports',
    //         label: 'Reports',
    //         icon: <IconBarChart size={18} strokeWidth={2} />,
    //         link:
    //           ref &&
    //           (isProjectPaused
    //             ? homeUrl
    //             : isProjectBuilding
    //             ? buildingUrl
    //             : `/project/${ref}/reports`),
    //       },
    //     ]
    //   : []),
    // ...(IS_PLATFORM
    //   ? [
    //       {
    //         key: 'logs',
    //         label: 'Logs',
    //         icon: <IconList size={18} strokeWidth={2} />,
    //         link:
    //           ref &&
    //           (isProjectPaused
    //             ? homeUrl
    //             : isProjectBuilding
    //             ? buildingUrl
    //             : `/project/${ref}/logs/explorer`),
    //       },
    //     ]
    //   : []),
    {
      key: 'api',
      label: 'API文档',
      icon: <IconFileText size={18} strokeWidth={2} />,
      link:
        ref &&
        (isProjectPaused ? homeUrl : isProjectBuilding ? buildingUrl : `/project/${ref}/api`),
    },
    ...(IS_PLATFORM
      ? [
          {
            key: 'settings',
            label: '应用设置',
            icon: <IconSettings size={18} strokeWidth={2} />,
            link: ref && `/project/${ref}/settings/api`,
          },
        ]
      : []),
  ]
}
