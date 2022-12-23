import { IS_PLATFORM } from 'lib/constants'
import { ProductMenuGroup } from 'components/ui/ProductMenu/ProductMenu.types'

export const generateAuthMenu = (ref: string): ProductMenuGroup[] => {
  return [
    {
      title: '管理',
      items: [{ name: '用户', key: 'users', url: `/project/${ref}/auth/users`, items: [] }],
    },

    {
      title: '配置',
      items: [
        {
          name: '策略',
          key: 'policies',
          url: `/project/${ref}/auth/policies`,
          items: [],
        },
        ...(IS_PLATFORM
          ? [
              {
                name: '服务商',
                key: 'providers',
                url: `/project/${ref}/auth/providers`,
                items: [],
              },
              {
                name: '邮件模板',
                key: 'templates',
                url: `/project/${ref}/auth/templates`,
                items: [],
              },

              {
                name: 'URL配置',
                key: 'url-configuration',
                url: `/project/${ref}/auth/url-configuration`,
                items: [],
              },
            ]
          : []),
      ],
    },
  ]
}
