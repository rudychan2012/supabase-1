import { useRouter } from 'next/router'
import { IconAlertCircle, IconLoader, Input } from 'ui'
import { JwtSecretUpdateStatus } from '@supabase/shared-types/out/events'
import { PermissionAction } from '@supabase/shared-types/out/constants'

import { checkPermissions, useJwtSecretUpdateStatus, useProjectSettings } from 'hooks'
import { DEFAULT_PROJECT_API_SERVICE_ID } from 'lib/constants'
import Panel from 'components/ui/Panel'

const DisplayApiSettings = () => {
  const router = useRouter()
  const { ref } = router.query

  const {
    services,
    error: projectSettingsError,
    isError: isProjectSettingsError,
    isLoading: isProjectSettingsLoading,
  } = useProjectSettings(ref as string | undefined)
  const {
    jwtSecretUpdateStatus,
    isError: isJwtSecretUpdateStatusError,
    isLoading: isJwtSecretUpdateStatusLoading,
  }: any = useJwtSecretUpdateStatus(ref)

  const canReadAPIKeys = checkPermissions(PermissionAction.READ, 'service_api_keys')

  const isNotUpdatingJwtSecret =
    jwtSecretUpdateStatus === undefined || jwtSecretUpdateStatus === JwtSecretUpdateStatus.Updated
  // Get the API service
  const apiService = (services ?? []).find((x: any) => x.app.id == DEFAULT_PROJECT_API_SERVICE_ID)
  const apiKeys = apiService?.service_api_keys ?? []
  // api keys should not be empty. However it can be populated with a delay on project creation
  const isApiKeysEmpty = apiKeys.length === 0

  return (
    <Panel
      title={
        <div className="space-y-3">
          <h5 className="text-base">应用API密钥</h5>
          <p className="text-sm text-scale-1000">
            您的服务受到API网关的保护，每个请求都需要一个API密钥。
            <br />
            您可以通过配置下面的密钥来使用Supabase各种客户端库。
          </p>
        </div>
      }
    >
      {isProjectSettingsError || isJwtSecretUpdateStatusError ? (
        <div className="flex items-center justify-center space-x-2 py-8">
          <IconAlertCircle size={16} strokeWidth={1.5} />
          <p className="text-sm text-scale-1100">
            {isProjectSettingsError ? '无法获取API密钥' : '无法更新JWT'}
          </p>
        </div>
      ) : isApiKeysEmpty || isProjectSettingsLoading || isJwtSecretUpdateStatusLoading ? (
        <div className="flex items-center justify-center space-x-2 py-8">
          <IconLoader className="animate-spin" size={16} strokeWidth={1.5} />
          <p className="text-sm text-scale-1100">
            {isProjectSettingsLoading || isApiKeysEmpty
              ? '正在获取API密钥'
              : 'JWT已更新'}
          </p>
        </div>
      ) : (
        apiKeys.map((x: any, i: number) => (
          <Panel.Content
            key={x.api_key}
            className={
              i >= 1 &&
              'border-t border-panel-border-interior-light dark:border-panel-border-interior-dark'
            }
          >
            <Input
              readOnly
              disabled
              layout="horizontal"
              className="input-mono"
              // @ts-ignore
              label={
                <>
                  {x.tags?.split(',').map((x: any, i: number) => (
                    <code key={`${x}${i}`} className="text-xs text-code">
                      {x}
                    </code>
                  ))}
                  {x.tags === 'service_role' && (
                    <>
                      <code className="bg-red-900 text-xs text-white">{'secret'}</code>
                    </>
                  )}
                  {x.tags === 'anon' && <code className="text-xs text-code">{'public'}</code>}
                </>
              }
              copy={canReadAPIKeys && isNotUpdatingJwtSecret}
              reveal={x.tags !== 'anon' && canReadAPIKeys && isNotUpdatingJwtSecret}
              value={
                !canReadAPIKeys
                  ? '您需要额外的权限才能查看API密钥'
                  : jwtSecretUpdateStatus === JwtSecretUpdateStatus.Failed
                  ? 'JWT更新失败，新的API密钥可能有问题'
                  : jwtSecretUpdateStatus === JwtSecretUpdateStatus.Updating
                  ? '更新JWT...'
                  : x.api_key
              }
              onChange={() => {}}
              descriptionText={
                x.tags === 'service_role'
                  ? '此密钥具有绕过行级安全性的能力，切勿公开分享。'
                  : '如果您为数据库表启用了行级安全并配置了策略，则可以在浏览器中安全地使用此密钥。'
              }
            />
          </Panel.Content>
        ))
      )}
    </Panel>
  )
}
export default DisplayApiSettings
