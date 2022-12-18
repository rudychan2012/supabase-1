import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { boolean, number, object, string } from 'yup'
import { PermissionAction } from '@supabase/shared-types/out/constants'
import { Button, Form, Input, IconEye, IconEyeOff, InputNumber, Toggle } from 'ui'

import { useStore, checkPermissions, useFlag } from 'hooks'
import {
  FormActions,
  FormHeader,
  FormPanel,
  FormSection,
  FormSectionContent,
  FormSectionLabel,
} from 'components/ui/Forms'

const AutoSchemaForm = observer(() => {
  const { authConfig, ui } = useStore()
  const { isLoaded } = authConfig

  const formId = 'auth-config-general-form'
  const [hidden, setHidden] = useState(true)

  const enablePermissions = useFlag('enablePermissions')
  const isOwner = ui.selectedOrganization?.is_owner

  const showMfaSso = useFlag('mfaSso')
  // const canUpdateConfig = checkPermissions(PermissionAction.UPDATE, 'custom_config_gotrue')
  const canUpdateConfig = enablePermissions
      ? checkPermissions(PermissionAction.UPDATE, 'custom_config_gotrue')
      : isOwner
  const INITIAL_VALUES = {
    DISABLE_SIGNUP: !authConfig.config.DISABLE_SIGNUP,
    SITE_URL: authConfig.config.SITE_URL,
    JWT_EXP: authConfig.config.JWT_EXP,
    REFRESH_TOKEN_ROTATION_ENABLED: authConfig.config.REFRESH_TOKEN_ROTATION_ENABLED || false,
    SECURITY_REFRESH_TOKEN_REUSE_INTERVAL: authConfig.config.SECURITY_REFRESH_TOKEN_REUSE_INTERVAL,
    SECURITY_CAPTCHA_ENABLED: authConfig.config.SECURITY_CAPTCHA_ENABLED || false,
    SECURITY_CAPTCHA_SECRET: authConfig.config.SECURITY_CAPTCHA_SECRET || '',
    MAX_ENROLLED_FACTORS: authConfig.config.MAX_ENROLLED_FACTORS,
  }

  const schema = object({
    DISABLE_SIGNUP: boolean().required(),
    SITE_URL: string().required('Must have a Site URL'),
    JWT_EXP: number()
      .max(604800, 'Must be less than 604800')
      .required('Must have a JWT expiry value'),
    REFRESH_TOKEN_ROTATION_ENABLED: boolean().required(),
    SECURITY_REFRESH_TOKEN_REUSE_INTERVAL: number()
      .min(0, 'Must be a value more than 0')
      .required('Must have a Reuse Interval value'),
    SECURITY_CAPTCHA_ENABLED: boolean().required(),
    SECURITY_CAPTCHA_SECRET: string().when('SECURITY_CAPTCHA_ENABLED', {
      is: true,
      then: string().required('Must have a hCaptcha secret'),
    }),
    MAX_ENROLLED_FACTORS: number()
      .min(0, 'Must be be a value more than 0')
      .max(30, 'Must be a value less than 30'),
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
        message: `Successfully updated settings`,
      })
      resetForm({ values: values, initialValues: values })
    } else {
      ui.setNotification({
        category: 'error',
        message: `Failed to update settings`,
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
              title="Auth设置"
              description="为您的用户配置身份验证"
            />
            <FormPanel
              disabled={!canUpdateConfig}
              footer={
                <div className="flex py-4 px-8">
                  <FormActions
                    form={formId}
                    isSubmitting={isSubmitting}
                    hasChanges={hasChanges}
                    handleReset={handleReset}
                    helper={
                      !canUpdateConfig
                        ? '您需要额外的权限才能修改身份验证设置'
                        : undefined
                    }
                  />
                </div>
              }
            >
              <FormSection header={<FormSectionLabel>用户注册</FormSectionLabel>}>
                <FormSectionContent loading={!isLoaded}>
                  <Toggle
                    id="DISABLE_SIGNUP"
                    size="small"
                    label="允许新用户注册"
                    layout="flex"
                    descriptionText="如果禁用此功能，新用户将无法注册您的应用程序"
                    disabled={!canUpdateConfig}
                  />
                </FormSectionContent>
              </FormSection>
              <div className="border-t border-scale-400"></div>
              <FormSection header={<FormSectionLabel>用户回话</FormSectionLabel>}>
                <FormSectionContent loading={!isLoaded}>
                  {/* Permitted redirects for anything on that domain */}
                  {/* Check with @kangming about this */}
                  <InputNumber
                    id="JWT_EXP"
                    size="small"
                    label="JWT过期时长"
                    descriptionText="JWT令牌的有效期多长，默认为 3600（1 小时），最大 604,800 秒（一周）"
                    actions={<span className="mr-3 text-scale-900">秒</span>}
                    disabled={!canUpdateConfig}
                  />
                </FormSectionContent>
              </FormSection>
              <FormSection header={<FormSectionLabel>安全与保护</FormSectionLabel>}>
                <FormSectionContent loading={!isLoaded}>
                  <Toggle
                    id="SECURITY_CAPTCHA_ENABLED"
                    size="small"
                    label="启用验证码保护"
                    layout="flex"
                    descriptionText="保护身份验证接口被恶意调用"
                    disabled={!canUpdateConfig}
                  />
                  {values.SECURITY_CAPTCHA_ENABLED && (
                    <Input
                      id="SECURITY_CAPTCHA_SECRET"
                      type={hidden ? 'password' : 'text'}
                      size="small"
                      label="hCaptcha密钥"
                      disabled={!canUpdateConfig}
                      actions={
                        <Button
                          icon={hidden ? <IconEye /> : <IconEyeOff />}
                          type="default"
                          onClick={() => setHidden(!hidden)}
                        />
                      }
                    />
                  )}
                  <Toggle
                    id="REFRESH_TOKEN_ROTATION_ENABLED"
                    size="small"
                    label="启用自动重用检测"
                    layout="flex"
                    descriptionText="防止来自构造令牌的重放攻击"
                    disabled={!canUpdateConfig}
                  />
                  {values.REFRESH_TOKEN_ROTATION_ENABLED && (
                    <InputNumber
                      id="SECURITY_REFRESH_TOKEN_REUSE_INTERVAL"
                      size="small"
                      min={0}
                      label="重用间隔"
                      descriptionText="同一刷新令牌可用于请求访问令牌的时间间隔."
                      actions={<span className="mr-3 text-scale-900">秒</span>}
                      disabled={!canUpdateConfig}
                    />
                  )}
                </FormSectionContent>
              </FormSection>
              {showMfaSso && (
                <FormSection
                  header={<FormSectionLabel>多因素认证(MFA)</FormSectionLabel>}
                >
                  <FormSectionContent loading={!isLoaded}>
                    <InputNumber
                      id="MAX_ENROLLED_FACTORS"
                      size="small"
                      label="注册校验因素的最大数量"
                      disabled={!canUpdateConfig}
                    />
                  </FormSectionContent>
                </FormSection>
              )}
            </FormPanel>
          </>
        )
      }}
    </Form>
  )
})

export default AutoSchemaForm
