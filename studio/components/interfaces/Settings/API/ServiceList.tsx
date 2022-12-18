import { FC, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { JwtSecretUpdateError, JwtSecretUpdateStatus } from '@supabase/shared-types/out/events'
import { IconAlertCircle, Input } from 'ui'

import {
  useStore,
  useProjectSettings,
  useProjectPostgrestConfig,
  useJwtSecretUpdateStatus,
} from 'hooks'

import Panel from 'components/ui/Panel'
import PostgrestConfig from './PostgrestConfig'
import { DisplayApiSettings } from 'components/ui/ProjectSettings'
import { JWT_SECRET_UPDATE_ERROR_MESSAGES } from './API.constants'
import JWTSettings from './JWTSettings'

interface Props {
  projectRef: string
}

const ServiceList: FC<Props> = ({ projectRef }) => {
  const { ui } = useStore()
  const router = useRouter()
  const { ref } = router.query

  const { services, isError, mutateSettings } = useProjectSettings(ref as string | undefined)
  const { mutateConfig } = useProjectPostgrestConfig(ref as string | undefined)
  const { jwtSecretUpdateError, jwtSecretUpdateStatus }: any = useJwtSecretUpdateStatus(ref)

  const previousJwtSecretUpdateStatus = useRef()
  const { Failed, Updated, Updating } = JwtSecretUpdateStatus
  const jwtSecretUpdateErrorMessage =
    JWT_SECRET_UPDATE_ERROR_MESSAGES[jwtSecretUpdateError as JwtSecretUpdateError]

  useEffect(() => {
    if (previousJwtSecretUpdateStatus.current === Updating) {
      switch (jwtSecretUpdateStatus) {
        case Updated:
          mutateConfig()
          mutateSettings()
          ui.setNotification({ category: 'success', message: '更新JWT密钥成功' })
          break
        case Failed:
          ui.setNotification({
            category: 'error',
            message: `更新JWT密钥失败: ${jwtSecretUpdateErrorMessage}`,
          })
          break
      }
    }

    previousJwtSecretUpdateStatus.current = jwtSecretUpdateStatus
  }, [jwtSecretUpdateStatus])

  // Get the API service
  const API_SERVICE_ID = 1
  const apiService = services ? services.find((x: any) => x.app.id == API_SERVICE_ID) : {}
  const apiConfig = apiService?.app_config

  return (
    <>
      <div className="">
        <h3 className="text-scale-1200 mb-6 text-xl">API设置</h3>
        <section>
          <Panel title={<h5 className="mb-0">应用API访问地址</h5>}>
            <Panel.Content>
              {isError ? (
                <div className="flex items-center justify-center space-x-2 py-4">
                  <IconAlertCircle size={16} strokeWidth={1.5} />
                  <p className="text-sm text-scale-1100">获取应用API访问地址失败</p>
                </div>
              ) : (
                <Input
                  copy
                  label="URL"
                  readOnly
                  disabled
                  className="input-mono"
                  value={`https://${apiConfig?.endpoint ?? '-'}`}
                  descriptionText="用于查询和管理数据库的RESTful服务地址"
                  layout="horizontal"
                />
              )}
            </Panel.Content>
          </Panel>
        </section>

        <section>
          <DisplayApiSettings key="DisplayAPISettings" />
        </section>

        <section>
          <JWTSettings />
        </section>

        <section>
          <PostgrestConfig />
        </section>
      </div>
    </>
  )
}

export default ServiceList
