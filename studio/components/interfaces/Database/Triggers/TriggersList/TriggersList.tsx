import { FC } from 'react'
import { includes, uniqBy, map as lodashMap } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Button, Input, IconSearch, IconLoader } from 'ui'
import { PermissionAction } from '@supabase/shared-types/out/constants'

import { checkPermissions, useStore } from 'hooks'
import SchemaTable from './SchemaTable'
import AlphaPreview from 'components/to-be-cleaned/AlphaPreview'
import ProductEmptyState from 'components/to-be-cleaned/ProductEmptyState'

const TriggersList: FC<any> = ({
  filterString,
  setFilterString = () => {},
  createTrigger = () => {},
  editTrigger = () => {},
  deleteTrigger = () => {},
}) => {
  const { meta } = useStore()
  const triggers = meta.triggers.list()
  const filteredTriggers = triggers.filter((x: any) =>
    includes(x.name.toLowerCase(), filterString.toLowerCase())
  )
  const filteredTriggerSchemas = lodashMap(uniqBy(filteredTriggers, 'schema'), 'schema')
  const canCreateTriggers = checkPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'triggers')

  if (meta.triggers.isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center space-x-2">
        <IconLoader className="animate-spin" size={14} />
        <p className="text-sm text-scale-1000">加载触发器...</p>
      </div>
    )
  }

  if (meta.triggers.hasError) {
    return (
      <div className="px-6 py-4 text-scale-1000">
        <p>连接到 API 时出错</p>
        <p>{`${meta.triggers.error?.message ?? 'Unknown error'}`}</p>
      </div>
    )
  }

  return (
    <>
      {triggers.length == 0 ? (
        <div className="flex h-full w-full items-center justify-center">
          <ProductEmptyState
            title="触发器"
            ctaButtonLabel="创建新触发器"
            onClickCta={() => createTrigger()}
          >
            <AlphaPreview />
            <p className="text-sm text-scale-1100">
              PostgreSQL 触发器是每当与表关联的事件发生时自动调用的函数。
            </p>
            <p className="text-sm text-scale-1100">
              事件可以是以下任何一种：INSERT、UPDATE、DELETE。触发器是与表关联的特殊的用户定义函数。
            </p>
          </ProductEmptyState>
        </div>
      ) : (
        <div className="w-full space-y-4 py-4">
          <div className="flex items-center justify-between px-6">
            <Input
              placeholder="按名称过滤"
              size="small"
              icon={<IconSearch size="tiny" />}
              value={filterString}
              onChange={(e) => setFilterString(e.target.value)}
            />
            <Tooltip.Root delayDuration={0}>
              <Tooltip.Trigger>
                <Button disabled={!canCreateTriggers} onClick={() => createTrigger()}>
                  创建新触发器
                </Button>
              </Tooltip.Trigger>
              {!canCreateTriggers && (
                <Tooltip.Content side="bottom">
                  <Tooltip.Arrow className="radix-tooltip-arrow" />
                  <div
                    className={[
                      'rounded bg-scale-100 py-1 px-2 leading-none shadow',
                      'border border-scale-200',
                    ].join(' ')}
                  >
                    <span className="text-xs text-scale-1200">
                      您需要额外的权限才能创建触发器
                    </span>
                  </div>
                </Tooltip.Content>
              )}
            </Tooltip.Root>
          </div>
          {filteredTriggers.length <= 0 && (
            <div className="mx-auto flex max-w-lg items-center justify-center space-x-3 rounded border p-6 shadow-md dark:border-dark">
              <p>没有结果符合您的筛选查询</p>
              <Button type="outline" onClick={() => setFilterString('')}>
                重置过滤器
              </Button>
            </div>
          )}
          {filteredTriggerSchemas.map((schema: any) => (
            <SchemaTable
              key={schema}
              filterString={filterString}
              schema={schema}
              editTrigger={editTrigger}
              deleteTrigger={deleteTrigger}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default observer(TriggersList)
