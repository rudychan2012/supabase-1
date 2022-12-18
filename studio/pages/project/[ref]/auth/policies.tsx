import React, { useState, FC } from 'react'
import { isEmpty } from 'lodash'
import { Button, IconSearch, Input, IconHelpCircle, IconExternalLink } from 'ui'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import { checkPermissions, useStore } from 'hooks'
import { AuthLayout } from 'components/layouts'
import { NextPageWithLayout } from 'types'
import { PolicyEditorModal, PolicyTableRow } from 'components/interfaces/Auth/Policies'
import { PostgresRole } from '@supabase/postgres-meta'
import { PostgresTable, PostgresPolicy } from '@supabase/postgres-meta'

import ConfirmModal from 'components/ui/Dialogs/ConfirmDialog'
import NoTableState from 'components/ui/States/NoTableState'
import NoSearchResults from 'components/to-be-cleaned/NoSearchResults'
import { PermissionAction } from '@supabase/shared-types/out/constants'
import NoPermission from 'components/ui/NoPermission'
import ProductEmptyState from 'components/to-be-cleaned/ProductEmptyState'
import InformationBox from 'components/ui/InformationBox'

/**
 * Filter tables by table name and policy name
 *
 * @param tables list of table
 * @param policies list of policy
 * @param searchString filter keywords
 *
 * @returns list of table
 */
const onFilterTables = (
  tables: PostgresTable[],
  policies: PostgresPolicy[],
  searchString?: string
) => {
  if (!searchString) {
    return tables.slice().sort((a: PostgresTable, b: PostgresTable) => a.name.localeCompare(b.name))
  } else {
    const filter = searchString.toLowerCase()
    const findSearchString = (s: string) => s.toLowerCase().includes(filter)
    // @ts-ignore Type instantiation is excessively deep and possibly infinite
    const filteredPolicies = policies.filter((p: PostgresPolicy) => findSearchString(p.name))
    return tables
      .slice()
      .filter((x: PostgresTable) => {
        const searchTableName = findSearchString(x.name)
        if (searchTableName) return true
        const searchPolicyName = filteredPolicies.some((p: PostgresPolicy) => p.table === x.name)
        return searchPolicyName
      })
      .sort((a: PostgresTable, b: PostgresTable) => a.name.localeCompare(b.name))
  }
}

const AuthPoliciesPage: NextPageWithLayout = () => {
  const { meta } = useStore()

  const [policiesFilter, setPoliciesFilter] = useState<string | undefined>(undefined)
  const publicTables = meta.tables.list((table: { schema: string }) => table.schema === 'public')
  const policies = meta.policies.list()
  const filteredTables = onFilterTables(publicTables, policies, policiesFilter)

  const canReadPolicies = checkPermissions(PermissionAction.TENANT_SQL_ADMIN_READ, 'policies')

  if (!canReadPolicies) {
    return <NoPermission isFullPage resourceText="查看应用的RLS策略" />
  }

  return (
    <div className="flex flex-col h-full">
      {(publicTables || []).length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <Input
              size="small"
              placeholder="过滤表和策略"
              className="block w-64 text-sm placeholder-gray-400"
              value={policiesFilter}
              onChange={(e) => setPoliciesFilter(e.target.value)}
              icon={<IconSearch size="tiny" />}
            />
            <Button type="link" icon={<IconExternalLink size={14} strokeWidth={1.5} />}>
              <a
                target="_blank"
                href="https://supabase.com/docs/learn/auth-deep-dive/auth-row-level-security"
              >
                什么是RLS?
              </a>
            </Button>
          </div>
        </div>
      )}
      <AuthPoliciesTables hasPublicTables={publicTables.length > 0} tables={filteredTables} />
    </div>
  )
}

AuthPoliciesPage.getLayout = (page) => (
  <AuthLayout title="Auth">
    <div className="h-full p-4">{page}</div>
  </AuthLayout>
)

export default observer(AuthPoliciesPage)

interface AuthPoliciesTablesProps {
  hasPublicTables: boolean
  tables: any[]
}
const AuthPoliciesTables: FC<AuthPoliciesTablesProps> = observer(({ tables, hasPublicTables }) => {
  const router = useRouter()
  const { ref } = router.query

  const { ui, meta } = useStore()
  const roles = meta.roles.list((role: PostgresRole) => !meta.roles.systemRoles.includes(role.name))

  const [selectedSchemaAndTable, setSelectedSchemaAndTable] = useState<any>({})
  const [selectedTableToToggleRLS, setSelectedTableToToggleRLS] = useState<any>({})
  const [selectedPolicyToEdit, setSelectedPolicyToEdit] = useState<any>({})
  const [selectedPolicyToDelete, setSelectedPolicyToDelete] = useState<any>({})

  const closePolicyEditorModal = () => {
    setSelectedPolicyToEdit({})
    setSelectedSchemaAndTable({})
  }

  const closeConfirmModal = () => {
    setSelectedPolicyToDelete({})
    setSelectedTableToToggleRLS({})
  }

  const onSelectToggleRLS = (table: any) => {
    setSelectedTableToToggleRLS(table)
  }

  const onSelectCreatePolicy = (table: any) => {
    setSelectedSchemaAndTable({ schema: table.schema, table: table.name })
  }

  const onSelectEditPolicy = (policy: any) => {
    setSelectedPolicyToEdit(policy)
    setSelectedSchemaAndTable({ schema: policy.schema, table: policy.table })
  }

  const onSelectDeletePolicy = (policy: any) => {
    setSelectedPolicyToDelete(policy)
  }

  const onSavePolicySuccess = async () => {
    ui.setNotification({ category: 'success', message: '策略保存成功!' })
    closePolicyEditorModal()
  }

  // Methods that involve some API
  const onToggleRLS = async () => {
    const payload = {
      id: selectedTableToToggleRLS.id,
      rls_enabled: !selectedTableToToggleRLS.rls_enabled,
    }

    const res: any = await meta.tables.update(payload.id, payload)
    if (res.error) {
      ui.setNotification({
        category: 'error',
        message: `起停RLS失败: ${res.error.message}`,
      })
    }
    closeConfirmModal()
  }

  const onCreatePolicy = async (payload: any) => {
    const res = await meta.policies.create(payload)
    if (res.error) {
      ui.setNotification({
        category: 'error',
        message: `添加策略失败: ${res.error.message}`,
      })
      return true
    }
    return false
  }

  const onUpdatePolicy = async (payload: any) => {
    const res = await meta.policies.update(payload.id, payload)
    if (res.error) {
      ui.setNotification({
        category: 'error',
        message: `更新策略失败: ${res.error.message}`,
      })
      return true
    }
    return false
  }

  const onDeletePolicy = async () => {
    const res = await meta.policies.del(selectedPolicyToDelete.id)
    if (typeof res !== 'boolean' && res.error) {
      ui.setNotification({
        category: 'error',
        message: `删除策略失败: ${res.error.message}`,
      })
    } else {
      ui.setNotification({ category: 'success', message: '删除策略成功!' })
    }
    closeConfirmModal()
  }

  return (
    <>
      {tables.length > 0 ? (
        tables.map((table: any) => (
          <section key={table.id}>
            <PolicyTableRow
              table={table}
              onSelectToggleRLS={onSelectToggleRLS}
              onSelectCreatePolicy={onSelectCreatePolicy}
              onSelectEditPolicy={onSelectEditPolicy}
              onSelectDeletePolicy={onSelectDeletePolicy}
            />
          </section>
        ))
      ) : hasPublicTables ? (
        <NoSearchResults />
      ) : (
        <div className="flex-grow">
          <ProductEmptyState
            size="large"
            title="Postgres策略"
            ctaButtonLabel="创建表"
            infoButtonLabel="什么是RLS?"
            infoButtonUrl="https://supabase.com/docs/guides/auth/row-level-security"
            onClickCta={() => router.push(`/project/${ref}/editor`)}
          >
            <div className="space-y-4">
              <InformationBox
                title="什么是策略？"
                icon={<IconHelpCircle strokeWidth={2} />}
                description={
                  <div className="space-y-2">
                    <p className="text-sm">
                      策略基于每个用户限制哪些行可以通过正常查询返回，或者通过修改命令插入、更新或删除。
                    </p>
                    <p className="text-sm">
                      这也称为行级安全性 (RLS)。每个策略附属在一张表上，每次访问该表时都会执行该策略。
                    </p>
                  </div>
                }
              />
              <p className="text-sm text-scale-1100">
                在创建行级安全策略之前，需要在public schema中建表.
              </p>
            </div>
          </ProductEmptyState>
        </div>
      )}

      <PolicyEditorModal
        visible={!isEmpty(selectedSchemaAndTable)}
        roles={roles}
        schema={selectedSchemaAndTable.schema}
        table={selectedSchemaAndTable.table}
        selectedPolicyToEdit={selectedPolicyToEdit}
        onSelectCancel={closePolicyEditorModal}
        // @ts-ignore
        onCreatePolicy={onCreatePolicy}
        // @ts-ignore
        onUpdatePolicy={onUpdatePolicy}
        onSaveSuccess={onSavePolicySuccess}
      />

      <ConfirmModal
        danger
        visible={!isEmpty(selectedPolicyToDelete)}
        title="确认删除策略"
        description={`这是永久性的！您确定要删除策略"${selectedPolicyToDelete.name}"吗？`}
        buttonLabel="删除"
        buttonLoadingLabel="正在删除"
        onSelectCancel={closeConfirmModal}
        onSelectConfirm={onDeletePolicy}
      />

      <ConfirmModal
        danger={selectedTableToToggleRLS.rls_enabled}
        visible={!isEmpty(selectedTableToToggleRLS)}
        title={`确认${selectedTableToToggleRLS.rls_enabled ? '停用' : '启用'} RLS`}
        description={`你确定要${
          selectedTableToToggleRLS.rls_enabled ? '停用' : '启用'
        }"${selectedTableToToggleRLS.name}"表的行级安全性?`}
        buttonLabel="确认"
        buttonLoadingLabel="保存中"
        onSelectCancel={closeConfirmModal}
        onSelectConfirm={onToggleRLS}
      />
    </>
  )
})
