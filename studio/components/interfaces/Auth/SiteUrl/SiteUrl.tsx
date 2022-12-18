import { PermissionAction } from '@supabase/shared-types/out/constants'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { Form, Input } from 'ui'
import { boolean, number, object, string } from 'yup'

import {
  FormActions,
  FormHeader,
  FormPanel,
  FormSection,
  FormSectionContent,
  FormSectionLabel,
} from 'components/ui/Forms'
import { checkPermissions, useStore } from 'hooks'

const SiteUrl = observer(() => {
  const { authConfig, ui } = useStore()
  const { isLoaded } = authConfig

  const formId = 'auth-config-general-form'
  const [hidden, setHidden] = useState(true)

  const canUpdateConfig = checkPermissions(PermissionAction.UPDATE, 'custom_config_gotrue')

  const INITIAL_VALUES = {
    DISABLE_SIGNUP: !authConfig.config.DISABLE_SIGNUP,
    JWT_EXP: authConfig.config.JWT_EXP,
    SITE_URL: authConfig.config.SITE_URL,
    REFRESH_TOKEN_ROTATION_ENABLED: authConfig.config.REFRESH_TOKEN_ROTATION_ENABLED || false,
    SECURITY_REFRESH_TOKEN_REUSE_INTERVAL: authConfig.config.SECURITY_REFRESH_TOKEN_REUSE_INTERVAL,
    SECURITY_CAPTCHA_ENABLED: authConfig.config.SECURITY_CAPTCHA_ENABLED || false,
    SECURITY_CAPTCHA_SECRET: authConfig.config.SECURITY_CAPTCHA_SECRET || '',
  }

  const schema = object({
    DISABLE_SIGNUP: boolean().required(),
    SITE_URL: string().required('必须具有网站URL'),
    JWT_EXP: number()
      .max(604800, '必须小于 604800')
      .required('必须具有 JWT 到期值'),
    REFRESH_TOKEN_ROTATION_ENABLED: boolean().required(),
    SECURITY_REFRESH_TOKEN_REUSE_INTERVAL: number()
      .min(0, '必须大于 0 的值')
      .required('必须具有Reuse Interval值'),
    SECURITY_CAPTCHA_ENABLED: boolean().required(),
    SECURITY_CAPTCHA_SECRET: string().when('SECURITY_CAPTCHA_ENABLED', {
      is: true,
      then: string().required('必须有一个 hCaptcha 秘密'),
    }),
  })

  const onSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    const payload = { ...values }
    payload.DISABLE_SIGNUP = !values.DISABLE_SIGNUP
    payload.SECURITY_CAPTCHA_PROVIDER = 'hcaptcha'

    setSubmitting(true)
    const { error } = await authConfig.update(payload)

    if (!error) {
      ui.setNotification({
        category: 'success',
        message: `已成功更新设置`,
      })
      resetForm({ values: values, initialValues: values })
    } else {
      ui.setNotification({
        category: 'error',
        message: `无法更新设置`,
      })
    }

    setSubmitting(false)
  }

  return (
    <Form id={formId} initialValues={INITIAL_VALUES} onSubmit={onSubmit} validationSchema={schema}>
      {({ isSubmitting, handleReset, resetForm, values, initialValues }: any) => {
        const hasChanges = JSON.stringify(values) !== JSON.stringify(initialValues)

        // Form is reset once remote data is loaded in store
        useEffect(() => {
          resetForm({ values: INITIAL_VALUES, initialValues: INITIAL_VALUES })
        }, [authConfig.isLoaded])

        return (
          <>
            <FormHeader
              title="网站URL"
              description="配置站点的网址。这用于密码重置电子邮件和其他链接。"
            />
            <FormPanel
              disabled={true}
              footer={
                <div className="flex py-4 px-8">
                  <FormActions
                    form={formId}
                    isSubmitting={isSubmitting}
                    hasChanges={hasChanges}
                    handleReset={handleReset}
                    disabled={!canUpdateConfig}
                    helper={
                      !canUpdateConfig
                        ? '您需要其他权限才能更新身份验证设置'
                        : undefined
                    }
                  />
                </div>
              }
            >
              <FormSection>
                <FormSectionContent loading={!isLoaded}>
                  <Input
                    id="SITE_URL"
                    size="small"
                    label="网站URL"
                    descriptionText="您网站的基本网址。用作重定向和构建电子邮件中使用的 URL 的允许列表。"
                    disabled={!canUpdateConfig}
                  />
                </FormSectionContent>
              </FormSection>
            </FormPanel>
          </>
        )
      }}
    </Form>
  )
})

export default SiteUrl
