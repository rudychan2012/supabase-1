import { Project } from 'types'
import { ProductMenuGroup } from 'components/ui/ProductMenu/ProductMenu.types'

export const generateDatabaseMenu = (project?: Project): ProductMenuGroup[] => {
  const ref = project?.ref ?? 'default'

  const HOOKS_RELEASED = '2021-07-30T15:33:54.383Z'
  const showHooksRoute = project?.inserted_at ? project.inserted_at > HOOKS_RELEASED : false

  return [
    {
      title: 'Database',
      items: [
        { name: '表', key: 'tables', url: `/project/${ref}/database/tables`, items: [] },
        {
          name: '触发器',
          key: 'triggers',
          url: `/project/${ref}/database/triggers`,
          items: [],
          isPreview: false,
        },
        {
          name: '函数',
          key: 'functions',
          url: `/project/${ref}/database/functions`,
          items: [],
          isPreview: false,
        },
        {
          name: '扩展',
          key: 'extensions',
          url: `/project/${ref}/database/extensions`,
          items: [],
        },
        { name: '角色', key: 'roles', url: `/project/${ref}/database/roles`, items: [] },
        {
          name: '副本',
          key: 'replication',
          url: `/project/${ref}/database/replication`,
          items: [],
        },
        // ...(showHooksRoute
        //   ? [
        //       {
        //         name: 'Webhooks',
        //         key: 'hooks',
        //         url: `/project/${ref}/database/hooks`,
        //         items: [],
        //         isPreview: true,
        //       },
        //     ]
        //   : []),
        // {
        //   name: 'Backups',
        //   key: 'backups',
        //   url: `/project/${ref}/database/backups/scheduled`,
        //   items: [],
        // },
      ],
    },
  ]
}
