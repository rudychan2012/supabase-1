import { useContext, FC, useEffect } from 'react'
import { indexOf } from 'lodash'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import { Input, Form, IconAlertCircle, InputNumber } from 'ui'
import { PermissionAction } from '@supabase/shared-types/out/constants'

import { checkPermissions, useStore, useProjectPostgrestConfig } from 'hooks'
import { API_URL } from 'lib/constants'
import { patch } from 'lib/common/fetch'
import MultiSelect from 'components/ui/MultiSelect'
import { PageContext } from 'pages/project/[ref]/settings/api'

import {
  FormActions,
  FormPanel,
  FormSection,
  FormSectionContent,
  FormSectionLabel,
} from 'components/ui/Forms'

interface Props {}

const PostgrestConfig: FC<Props> = ({}) => {
  const PageState: any = useContext(PageContext)
  const { ui } = useStore()
  const { meta } = PageState

  const router = useRouter()
  const { ref } = router.query

  const formId = 'project-postgres-config'
  const { config, isError, isLoading, mutateConfig } = useProjectPostgrestConfig(ref as string | undefined)

  const initialValues = {
    db_schema: '',
    max_rows: '',
    db_extra_search_path: '',
  }

  const canUpdatePostgrestConfig = checkPermissions(
    PermissionAction.UPDATE,
    'custom_config_postgrest'
  )

  const updateConfig = async (updatedConfig: any) => {
    try {
      const response = await patch(`${API_URL}/projects/${ref}/config/postgrest`, updatedConfig)
      if (response.error) {
        throw response.error
      } else {
        mutateConfig({...config, ...updatedConfig})
        ui.setNotification({ category: 'success', message: '保存设置成功' })
      }
    } catch (error: any) {
      ui.setNotification({
        error,
        category: 'error',
        message: `更新设置失败: ${error.message}`,
      })
    }
  }

  const permanentSchema = ['public', 'storage']
  const hiddenSchema = ['auth', 'pgbouncer', 'hooks', 'extensions']
  const schema =
    meta.schemas
      .list(
        (x: any) => {
          const find = indexOf(hiddenSchema, x.name)
          if (find < 0) return x
        },
        { allSchemas: true }
      )
      .map((x: any) => {
        return {
          id: x.id,
          value: x.name,
          name: x.name,
          disabled: indexOf(permanentSchema, x.name) >= 0 ? true : false,
        }
      }) ?? []

  return (
    <Form id={formId} initialValues={initialValues} validate={() => {}} onSubmit={updateConfig}>
      {({ isSubmitting, handleReset, resetForm, values, initialValues }: any) => {
        const hasChanges = JSON.stringify(values) !== JSON.stringify(initialValues)

        useEffect(() => {
          if (!isLoading && config) {
            const values = {
              db_schema: config.db_schema,
              max_rows: config.max_rows,
              db_extra_search_path: config.db_extra_search_path ?? '',
            }
            resetForm({ values, initialValues: values })
          }
        }, [isLoading])

        return (
          <>
            <FormPanel
              disabled={true}
              header={<p>API设置</p>}
              footer={
                <div className="flex py-4 px-8">
                  <FormActions
                    form={formId}
                    isSubmitting={isSubmitting}
                    hasChanges={hasChanges}
                    handleReset={handleReset}
                    disabled={!canUpdatePostgrestConfig}
                    helper={
                      !canUpdatePostgrestConfig
                        ? "您需要额外的权限才能更新应用的API设置"
                        : undefined
                    }
                  />
                </div>
              }
            >
              {isError ? (
                <div className="flex items-center justify-center space-x-2 py-8">
                  <IconAlertCircle size={16} strokeWidth={1.5} />
                  <p className="text-sm text-scale-1100">获取API设置失败</p>
                </div>
              ) : (
                <>
                  <FormSection header={<FormSectionLabel>公开的schemas</FormSectionLabel>}>
                    <FormSectionContent loading={false}>
                      {schema.length >= 1 && (
                        <MultiSelect
                          disabled={!canUpdatePostgrestConfig}
                          options={schema}
                          descriptionText={
                            <>
                              公开的schema。才可以通过API访问该schema中的表、视图和存储过程。
                              <code className="text-xs">public</code> 和{' '}
                              <code className="text-xs">storage</code>默认公开.
                            </>
                          }
                          emptyMessage={
                            <>
                              <IconAlertCircle strokeWidth={2} />
                              <div className="mt-2 flex flex-col text-center">
                                <p className="align-center text-sm">
                                  没有可供选择的schema
                                </p>
                                <p className="text-xs opacity-50">
                                  您新建的schema会出现在这里
                                </p>
                              </div>
                            </>
                          }
                          // value must be passed as array of strings
                          value={(values?.db_schema ?? '').replace(/ /g, '').split(',')}
                          // onChange returns array of strings
                          onChange={(event) => {
                            let updatedValues: any = values
                            updatedValues.db_schema = event.join(', ')
                            resetForm({ values: updatedValues, initialValues: updatedValues })
                            updateConfig({ ...updatedValues })
                          }}
                        />
                      )}
                    </FormSectionContent>
                  </FormSection>
                  <FormSection header={<FormSectionLabel>额外的搜索路径</FormSectionLabel>}>
                    <FormSectionContent loading={false}>
                      <Input
                        id="db_extra_search_path"
                        size="small"
                        disabled={!canUpdatePostgrestConfig}
                        descriptionText="添加到每个请求可以搜索的的额外schema，多个schema必须以逗号分隔。"
                      />
                    </FormSectionContent>
                  </FormSection>
                  <FormSection header={<FormSectionLabel>最大行数</FormSectionLabel>}>
                    <FormSectionContent loading={false}>
                      <InputNumber
                        id="max_rows"
                        size="small"
                        disabled={!canUpdatePostgrestConfig}
                        descriptionText="从视图、表或存储过程返回的最大行数，限制意外或恶意请求的负载大小。"
                      />
                    </FormSectionContent>
                  </FormSection>
                </>
              )}
            </FormPanel>
          </>
        )
      }}
    </Form>
  )
}

export default observer(PostgrestConfig)
