import { ProductMenuGroup } from 'components/ui/ProductMenu/ProductMenu.types'
import { IconBook, IconBookOpen } from 'ui'

export const generateDocsMenu = (
  ref: string,
  tables: string[],
  functions: string[]
): ProductMenuGroup[] => {
  return [
    {
      title: '开始入门',
      items: [
        { name: '介绍', key: 'introduction', url: `/project/${ref}/api`, items: [] },
        {
          name: '认证',
          key: 'auth',
          url: `/project/${ref}/api?page=auth`,
          items: [],
        },
        {
          name: '用户管理',
          key: 'users',
          url: `/project/${ref}/api?page=users`,
          items: [],
        },
      ],
    },
    {
      title: '表和视图',
      items: [
        {
          name: '介绍',
          key: 'tables-intro',
          url: `/project/${ref}/api?page=tables-intro`,
          items: [],
        },
        ...tables.sort().map((table) => {
          return {
            name: table,
            key: table,
            url: `/project/${ref}/api?resource=${table}`,
            items: [],
          }
        }),
      ],
    },
    {
      title: '存储过程',
      items: [
        {
          name: '介绍',
          key: 'rpc-intro',
          url: `/project/${ref}/api?page=rpc-intro`,
          items: [],
        },
        ...functions.map((fn) => {
          return { name: fn, key: fn, url: `/project/${ref}/api?rpc=${fn}`, items: [] }
        }),
      ],
    },
    {
      title: '更多资源',
      items: [
        {
          name: '指南',
          key: 'guides',
          url: `https://supabase.com/docs`,
          icon: <IconBook size={14} strokeWidth={2} />,
          items: [],
          isExternal: true,
        },
        {
          name: 'API参考',
          key: 'api-reference',
          url: `https://supabase.com/docs/guides/api`,
          icon: <IconBookOpen size={14} strokeWidth={2} />,
          items: [],
          isExternal: true,
        },
      ],
    },
  ]
}
