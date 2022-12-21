import { FC } from 'react'
import { uniqBy, map as lodashMap, includes } from 'lodash'
import { Button, IconSearch, IconLoader, Input } from 'ui'
import { observer } from 'mobx-react-lite'
import * as Tooltip from '@radix-ui/react-tooltip'
import { PermissionAction } from '@supabase/shared-types/out/constants'

import { checkPermissions, useStore } from 'hooks'
import AlphaPreview from 'components/to-be-cleaned/AlphaPreview'
import ProductEmptyState from 'components/to-be-cleaned/ProductEmptyState'
import SchemaTable from './SchemaTable'

const FunctionsList: FC<any> = ({
  filterString,
  setFilterString = () => {},
  createFunction = () => {},
  editFunction = () => {},
  deleteFunction = () => {},
}) => {
  const { meta } = useStore()
  const functions = meta.functions.list((fn: any) => !meta.excludedSchemas.includes(fn.schema))
  const filteredFunctions = functions.filter((x: any) =>
    includes(x.name.toLowerCase(), filterString.toLowerCase())
  )
  const filteredFunctionSchemas = lodashMap(uniqBy(filteredFunctions, 'schema'), 'schema')
  const canCreateFunctions = checkPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'functions')

  if (meta.functions.isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center space-x-2">
        <IconLoader className="animate-spin" size={14} />
        <p>加载函数...</p>
      </div>
    )
  }

  if (meta.functions.hasError) {
    return (
      <p className="px-6 py-4">
        <p>Error connecting to API</p>
        <p>{`${meta.functions.error?.message ?? '未知错误'}`}</p>
      </p>
    )
  }

  return (
    <>
      {functions.length == 0 ? (
        <div className="flex h-full w-full items-center justify-center">
          <ProductEmptyState
            title="函数"
            ctaButtonLabel="创建一个新函数"
            onClickCta={() => createFunction()}
          >
            <AlphaPreview />
            <p className="text-sm text-scale-1100">
              PostgreSQL函数，也称为存储过程，是一组 SQL 和过程命令，例如声明、赋值、循环、控制流等。
            </p>
            <p className="text-sm text-scale-1100">
              它存储在数据库服务器上，可以使用 SQL 接口调用。
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
                <Button disabled={!canCreateFunctions} onClick={() => createFunction()}>
                  创建一个新函数
                </Button>
              </Tooltip.Trigger>
              {!canCreateFunctions && (
                <Tooltip.Content side="bottom">
                  <Tooltip.Arrow className="radix-tooltip-arrow" />
                  <div
                    className={[
                      'rounded bg-scale-100 py-1 px-2 leading-none shadow',
                      'border border-scale-200',
                    ].join(' ')}
                  >
                    <span className="text-xs text-scale-1200">
                      您需要额外的权限才能创建函数
                    </span>
                  </div>
                </Tooltip.Content>
              )}
            </Tooltip.Root>
          </div>
          {filteredFunctions.length <= 0 && (
            <div className="mx-auto flex max-w-lg items-center justify-center space-x-3 rounded border p-6 shadow-md dark:border-dark">
              <p>没有结果符合您的筛选查询</p>
              <Button type="outline" onClick={() => setFilterString('')}>
                重置过滤器
              </Button>
            </div>
          )}
          {filteredFunctionSchemas.map((schema: any) => (
            <SchemaTable
              key={schema}
              filterString={filterString}
              schema={schema}
              editFunction={editFunction}
              deleteFunction={deleteFunction}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default observer(FunctionsList)
