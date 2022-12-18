import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Input, IconLoader, IconAlertCircle } from 'ui'
import { JwtSecretUpdateStatus } from '@supabase/shared-types/out/events'
import { PermissionAction } from '@supabase/shared-types/out/constants'

import { checkPermissions, useJwtSecretUpdateStatus, useProjectSettings } from 'hooks'
import { DEFAULT_PROJECT_API_SERVICE_ID } from 'lib/constants'
import Snippets from 'components/to-be-cleaned/Docs/Snippets'
import Panel from 'components/ui/Panel'
import SimpleCodeBlock from 'components/to-be-cleaned/SimpleCodeBlock'

const APIKeys = () => {
  const router = useRouter()
  const { ref } = router.query

  const availableLanguages = [
    { name: 'Javascript', key: 'js' },
    { name: 'Dart', key: 'dart' },
  ]
  const [selectedLanguage, setSelectedLanguage] = useState(availableLanguages[0])

  const {
    services,
    isError: isProjectSettingsError,
    isLoading: isProjectSettingsLoading,
  } = useProjectSettings(ref as string | undefined)

  const {
    jwtSecretUpdateStatus,
    isError: isJwtSecretUpdateStatusError,
    isLoading: isJwtSecretUpdateStatusLoading,
  }: any = useJwtSecretUpdateStatus(ref)

  const canReadAPIKeys = checkPermissions(PermissionAction.READ, 'service_api_keys')

  // Get the API service
  const apiService = (services ?? []).find((x: any) => x.app.id == DEFAULT_PROJECT_API_SERVICE_ID)
  const apiConfig = apiService?.app_config ?? {}
  const apiKeys = apiService?.service_api_keys ?? []

  // API keys should not be empty. However it can be populated with a delay on project creation
  const isApiKeysEmpty = apiKeys.length === 0
  const isNotUpdatingJwtSecret =
    jwtSecretUpdateStatus === undefined || jwtSecretUpdateStatus === JwtSecretUpdateStatus.Updated

  const apiUrl = `https://${apiConfig.endpoint}`
  const anonKey = apiKeys.find((key: any) => key.tags === 'anon')

  const clientInitSnippet: any = Snippets.init(apiUrl)
  const selectedLanguageSnippet =
    clientInitSnippet[selectedLanguage.key]?.code ?? 'No snippet available'

  return (
    <Panel
      title={
        <div className="space-y-3">
          <h5 className="text-base">应用 API</h5>
          <p className="text-sm text-scale-1000">
            您的 API 受到 API 网关的保护，每个请求都需要一个 API 密钥。
            <br />
            您可以使用以下参数来使用 Supabase 客户端库。
          </p>
        </div>
      }
    >
      {isProjectSettingsError || isJwtSecretUpdateStatusError ? (
        <div className="py-8 flex items-center justify-center space-x-2">
          <IconAlertCircle size={16} strokeWidth={1.5} />
          <p className="text-sm text-scale-1100">
            {isProjectSettingsError ? '无法获取 API 密钥': '无法更新 JWT 密码'}
          </p>
        </div>
      ) : isApiKeysEmpty || isProjectSettingsLoading || isJwtSecretUpdateStatusLoading ? (
        <div className="py-8 flex items-center justify-center space-x-2">
          <IconLoader className="animate-spin" size={16} strokeWidth={1.5} />
          <p className="text-sm text-scale-1100">
            {isProjectSettingsLoading || isApiKeysEmpty
              ? '获取 API 密钥'
              : 'JWT secret 正在更新'}
          </p>
        </div>
      ) : (
        <>
          <Panel.Content>
            <Input
              label="应用 URL"
              readOnly
              copy
              disabled
              className="input-mono"
              value={apiUrl}
              descriptionText="用于查询和管理数据库的 RESTful 根路径。"
              layout="horizontal"
            />
          </Panel.Content>
          <Panel.Content
            className={
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
                <div className="space-y-2">
                  <p className="text-sm">API Key</p>
                  <div className="flex items-center space-x-1 -ml-1">
                    {anonKey.tags?.split(',').map((x: any, i: number) => (
                      <code key={`${x}${i}`} className="text-xs">
                        {x}
                      </code>
                    ))}
                    <code className="text-xs">{'public'}</code>
                  </div>
                </div>
              }
              copy={canReadAPIKeys && isNotUpdatingJwtSecret}
              reveal={anonKey.tags !== 'anon' && canReadAPIKeys && isNotUpdatingJwtSecret}
              value={
                !canReadAPIKeys
                  ? 'You need additional permissions to view API keys'
                  : jwtSecretUpdateStatus === JwtSecretUpdateStatus.Failed
                  ? 'JWT secret update failed, new API key may have issues'
                  : jwtSecretUpdateStatus === JwtSecretUpdateStatus.Updating
                  ? 'Updating JWT secret...'
                  : anonKey.api_key
              }
              onChange={() => {}}
              descriptionText={
                <p>
                  如果您为表启用了行级安全保护 (RLS) 并配置了策略，则可以在浏览器中安全地使用此密钥。您也可以在{' '}
                  <Link href={`/project/${ref}/settings/api`}>
                    <a className="text-brand-800 hover:text-brand-900 transition">这里</a>
                  </Link>{' '}
                  找到并使用服务密钥（service key）来绕过行级安全保护 (RLS)。
                </p>
              }
            />
          </Panel.Content>
          <div className="border-t border-panel-border-interior-light dark:border-panel-border-interior-dark">
            <div className="flex items-center bg-scale-200">
              {availableLanguages.map((language) => {
                const isSelected = selectedLanguage.key === language.key
                return (
                  <div
                    key={language.key}
                    className={[
                      'px-3 py-1 text-sm cursor-pointer transition',
                      `${!isSelected ? 'bg-scale-200 text-scale-1000' : 'bg-scale-300'}`,
                    ].join(' ')}
                    onClick={() => setSelectedLanguage(language)}
                  >
                    {language.name}
                  </div>
                )
              })}
            </div>
            <div className="bg-scale-300 px-4 py-6 min-h-[200px]">
              <SimpleCodeBlock className={selectedLanguage.key}>
                {selectedLanguageSnippet}
              </SimpleCodeBlock>
            </div>
          </div>
        </>
      )}
    </Panel>
  )
}

export default APIKeys
