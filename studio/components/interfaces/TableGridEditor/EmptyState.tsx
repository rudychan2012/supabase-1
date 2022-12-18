import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { PostgresTable } from '@supabase/postgres-meta'
import { PermissionAction } from '@supabase/shared-types/out/constants'
import { checkPermissions, useStore } from 'hooks'
import ProductEmptyState from 'components/to-be-cleaned/ProductEmptyState'

interface Props {
  selectedSchema: string
  onAddTable: () => void
}

const EmptyState: FC<Props> = ({ selectedSchema, onAddTable }) => {
  const { meta } = useStore()
  const tables = meta.tables.list((table: PostgresTable) => table.schema === selectedSchema)
  const isProtectedSchema = meta.excludedSchemas.includes(selectedSchema)
  const canCreateTables =
    !isProtectedSchema && checkPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'tables')

  return (
    <div className="w-full h-full flex items-center justify-center">
      {tables.length === 0 ? (
        <ProductEmptyState
          title="表编辑器"
          ctaButtonLabel={canCreateTables ? '创建一个新表' : undefined}
          onClickCta={canCreateTables ? onAddTable : undefined}
        >
          <p className="text-sm text-scale-1100">此schema中没有可用的表。</p>
        </ProductEmptyState>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <ProductEmptyState
            title="表编辑器"
            ctaButtonLabel={canCreateTables ? '创建一个新表' : undefined}
            onClickCta={canCreateTables ? onAddTable : undefined}
          >
            <p className="text-sm text-scale-1100">
              从左侧的导航面板中选择一个表以查看其数据
              {canCreateTables && ', 或创建一个新表。'}
            </p>
          </ProductEmptyState>
        </div>
      )}
    </div>
  )
}

export default observer(EmptyState)
