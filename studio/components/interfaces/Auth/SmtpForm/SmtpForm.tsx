import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { number, object, string } from 'yup'
import { PermissionAction } from '@supabase/shared-types/out/constants'
import { Alert, Button, Form, Input, InputNumber, Toggle, IconEye, IconEyeOff } from 'ui'

import {
  FormActions,
  FormHeader,
  FormPanel,
  FormSection,
  FormSectionContent,
  FormSectionLabel,
} from 'components/ui/Forms'
import { useStore, checkPermissions } from 'hooks'
import { domainRegex } from './../Auth.constants'
import { defaultDisabledSmtpFormValues } from './SmtpForm.constants'
import { generateFormValues, isSmtpEnabled } from './SmtpForm.utils'

const SmtpForm = () => {
  const { authConfig, ui } = useStore()
  const { config, isLoaded } = authConfig

  const [enableSmtp, setEnableSmtp] = useState(false)
  const [hidden, setHidden] = useState(true)

  const formId = 'auth-config-smtp-form'
  const initialValues = generateFormValues(authConfig.config)
  const canUpdateConfig = checkPermissions(PermissionAction.UPDATE, 'custom_config_gotrue')

  useEffect(() => {
    if (isLoaded && isSmtpEnabled(config)) {
      setEnableSmtp(true)
    }
  }, [isLoaded])

  const schema = object({
    SMTP_ADMIN_EMAIL: string().when([], {
      is: () => {
        return enableSmtp
      },
      then: (schema) => schema.email('必须是邮箱格式').required('邮件地址必填'),
      otherwise: (schema) => schema,
    }),
    SMTP_SENDER_NAME: string().when([], {
      is: () => {
        return enableSmtp
      },
      then: (schema) => schema.required('发件人姓名为必填项'),
      otherwise: (schema) => schema,
    }),
    SMTP_HOST: string().when([], {
      is: () => {
        return enableSmtp
      },
      then: (schema) =>
        schema
          .matches(domainRegex, '必须是有效的URL或IP地址')
          .required('主机URL必填'),
      otherwise: (schema) => schema,
    }),
    SMTP_PORT: number().when([], {
      is: () => {
        return enableSmtp
      },
      then: (schema) =>
        schema
          .required('端口号必填')
          .min(1, '必须是大于零的有效端口号')
          .max(65535, '端口号必须小于65535'),
      otherwise: (schema) => schema,
    }),
    SMTP_MAX_FREQUENCY: number().when([], {
      is: () => {
        return enableSmtp
      },
      then: (schema) =>
        schema
          .required('速率限制必填')
          .min(1, '必须大于零')
          .max(32767, '必须小于32767个小时'),
      otherwise: (schema) => schema,
    }),
    SMTP_USER: string().when([], {
      is: () => {
        return enableSmtp
      },
      then: (schema) => schema.required('SMTP用户名必填'),
      otherwise: (schema) => schema,
    }),
    SMTP_PASS: string().when([], {
      is: () => {
        return enableSmtp
      },
      then: (schema) => schema.required('SMTP密码必填'),
      otherwise: (schema) => schema,
    }),
  })

  const onSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    const payload = enableSmtp ? values : defaultDisabledSmtpFormValues

    // Format payload: Remove redundant value + convert port to string
    delete payload.ENABLE_SMTP
    payload.SMTP_PORT = payload.SMTP_PORT ? payload.SMTP_PORT.toString() : payload.SMTP_PORT

    setSubmitting(true)
    const { error } = await authConfig.update(payload)

    if (!error) {
      setHidden(true)
      const updatedFormValues = generateFormValues(payload)
      resetForm({ values: updatedFormValues, initialValues: updatedFormValues })
      ui.setNotification({ category: 'success', message: '更新设置成功' })
    } else {
      ui.setNotification({ category: 'error', message: '更新设置失败', error })
    }

    setSubmitting(false)
  }

  return (
    <Form id={formId} initialValues={initialValues} onSubmit={onSubmit} validationSchema={schema}>
      {({ isSubmitting, resetForm, values }: any) => {
        const isValidSmtpConfig = isSmtpEnabled(values)
        const hasChanges = JSON.stringify(values) !== JSON.stringify(initialValues)

        useEffect(() => {
          if (isLoaded) {
            const formValues = generateFormValues(config)
            resetForm({ values: formValues, initialValues: formValues })
          }
        }, [isLoaded])

        const onResetForm = () => {
          setEnableSmtp(isSmtpEnabled(initialValues))
          resetForm({ values: initialValues })
        }

        return (
          <>
            <FormHeader
              title="SMTP设置"
              description="您可以使用自己的SMTP服务器代替内置的邮件服务"
            />
            <FormPanel
              footer={
                <div className="flex py-4 px-8">
                  <FormActions
                    form={formId}
                    isSubmitting={isSubmitting}
                    hasChanges={hasChanges}
                    handleReset={onResetForm}
                    disabled={!canUpdateConfig}
                    helper={
                      !canUpdateConfig
                        ? '您需要额外的权限才能更新身份验证设置'
                        : undefined
                    }
                  />
                </div>
              }
            >
              <FormSection>
                <FormSectionContent loading={!isLoaded}>
                  <Toggle
                    name="ENABLE_SMTP"
                    size="small"
                    label="启用自定义SMTP"
                    layout="flex"
                    checked={enableSmtp}
                    disabled={!canUpdateConfig}
                    // @ts-ignore
                    onChange={(value: boolean) => setEnableSmtp(value)}
                    descriptionText="将使用您的自定义SMTP服务发送电子邮件"
                  />
                </FormSectionContent>
              </FormSection>

              {enableSmtp && !isValidSmtpConfig && (
                <div className="mx-8 mb-8 -mt-4">
                  <Alert withIcon variant="warning" title="以下所有字段都必须填写">
                    必须填写以下字段才能正确启用自定义SMTP
                  </Alert>
                </div>
              )}

              <FormSection
                visible={enableSmtp}
                header={<FormSectionLabel>发送人信息</FormSectionLabel>}
                disabled={!enableSmtp}
              >
                <FormSectionContent loading={!isLoaded}>
                  <Input
                    name="SMTP_ADMIN_EMAIL"
                    id="SMTP_ADMIN_EMAIL"
                    label="发送人邮箱"
                    descriptionText="这是发送人的电子邮件地址"
                    placeholder="noreply@yourdomain.com"
                    disabled={!canUpdateConfig}
                  />
                  <Input
                    name="SMTP_SENDER_NAME"
                    id="SMTP_SENDER_NAME"
                    label="发送人名称"
                    descriptionText="收件人收件箱中显示的姓名"
                    placeholder="收件箱中显示的名字"
                    disabled={!canUpdateConfig}
                  />
                </FormSectionContent>
              </FormSection>

              <FormSection
                visible={enableSmtp}
                disabled={!enableSmtp}
                header={
                  <FormSectionLabel>
                    <span>SMTP服务配置</span>
                    <p className="my-4 text-scale-900">
                      您的SMTP凭据将始终在我们的数据库中加密。
                    </p>
                  </FormSectionLabel>
                }
              >
                <FormSectionContent loading={!isLoaded}>
                  <Input
                    name="SMTP_HOST"
                    placeholder="your.smtp.host.com"
                    id="SMTP_HOST"
                    label="服务地址"
                    descriptionText="SMTP服务器的主机名或IP地址"
                    disabled={!canUpdateConfig}
                  />
                  <InputNumber
                    name="SMTP_PORT"
                    id="SMTP_PORT"
                    placeholder="587"
                    label="端口号"
                    descriptionText={
                      <>
                        <span className="block">
                          SMTP服务器使用的端口，常用端口包括25、465和587.{' '}
                        </span>
                        <span className="mt-2 block">
                          避免使用端口25，因为现代SMTP电子邮件客户端不应使用此端口，它通常被ISP和云托管服务商阻止，以减少垃圾邮件的数量
                        </span>
                      </>
                    }
                    disabled={!canUpdateConfig}
                  />
                  <InputNumber
                    id="SMTP_MAX_FREQUENCY"
                    name="SMTP_MAX_FREQUENCY"
                    label="发送电子邮件之间的最小间隔"
                    descriptionText="SMTP服务发送任意两封电子邮件的最小间隔时间"
                    actions={<span className="mr-3 text-scale-900">秒</span>}
                    disabled={!canUpdateConfig}
                  />
                  <InputNumber
                    name="RATE_LIMIT_EMAIL_SENT"
                    id="RATE_LIMIT_EMAIL_SENT"
                    min={0}
                    label="发送电子邮件的速率限制"
                    descriptionText="每小时可以发送多少封电子邮件"
                    actions={<span className="mr-3 text-scale-900">封邮件/每小时</span>}
                    disabled={!canUpdateConfig}
                  />
                  <Input
                    name="SMTP_USER"
                    id="SMTP_USER"
                    label="用户名"
                    placeholder="SMTP用户名"
                    disabled={!canUpdateConfig}
                  />
                  <Input
                    name="SMTP_PASS"
                    id="SMTP_PASS"
                    type={hidden ? 'password' : 'text'}
                    label="密码"
                    placeholder="SMTP密码"
                    actions={
                      <Button
                        icon={hidden ? <IconEye /> : <IconEyeOff />}
                        type="default"
                        onClick={() => setHidden(!hidden)}
                      />
                    }
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
}

export default observer(SmtpForm)
