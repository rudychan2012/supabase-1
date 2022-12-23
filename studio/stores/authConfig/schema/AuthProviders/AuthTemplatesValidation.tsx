import { FormSchema } from 'types'
import { object, string } from 'yup'

const JSON_SCHEMA_VERSION = 'http://json-schema.org/draft-07/schema#'

export const CONFIRMATION: FormSchema = {
  $schema: JSON_SCHEMA_VERSION,
  id: 'CONFIRMATION',
  type: 'object',
  title: '确认注册',
  properties: {
    MAILER_SUBJECTS_CONFIRMATION: {
      title: '主题',
      type: 'string',
    },
    MAILER_TEMPLATES_CONFIRMATION_CONTENT: {
      title: '邮件正文',
      descriptionOptional: '电子邮件的 HTML 正文',
      type: 'code',
      description: ` 
- \`{{ .ConfirmationURL }}\` : 用于确认消息的URL
`,
    },
  },
  validationSchema: object().shape({
    MAILER_SUBJECTS_CONFIRMATION: string().required('"主题为必填项。'),
  }),
  misc: {
    iconKey: 'email-icon2',
    helper: `要完成设置，请将此授权回调 URL 添加到 Apple 开发者控制台中的应用配置中。
            [了解更多信息](https://supabase.com/docs/guides/auth/auth-apple#configure-your-services-id)`,
  },
}

export const INVITE: FormSchema = {
  $schema: JSON_SCHEMA_VERSION,
  id: 'INVITE',
  type: 'object',
  title: '邀请用户',
  properties: {
    MAILER_SUBJECTS_INVITE: {
      title: '主题',
      type: 'string',
    },
    MAILER_TEMPLATES_INVITE_CONTENT: {
      title: '邮件正',
      descriptionOptional: '电子邮件的 HTML 正文',
      type: 'code',
      description: ` 
- \`{{ .ConfirmationURL }}\` : 用于确认消息的URL
`,
    },
  },
  validationSchema: object().shape({
    MAILER_SUBJECTS_INVITE: string().required('"S标题为必填项。'),
  }),
  misc: {
    iconKey: 'email-icon2',
    helper: `要完成设置，请将此授权回调 URL 添加到 Apple 开发者控制台中的应用配置中。
            [了解更多信息](https://supabase.com/docs/guides/auth/auth-apple#configure-your-services-id)`,
  },
}

export const MAGIC_LINK: FormSchema = {
  $schema: JSON_SCHEMA_VERSION,
  id: 'MAGIC_LINK',
  type: 'object',
  title: '魔法链接',
  properties: {
    MAILER_SUBJECTS_MAGIC_LINK: {
      title: '主题',
      type: 'string',
    },
    MAILER_TEMPLATES_MAGIC_LINK_CONTENT: {
      title: '邮件正文',
      descriptionOptional: '电子邮件的 HTML 正文',
      type: 'code',
      description: ` 
- \`{{ .ConfirmationURL }}\` : 用于确认消息的网址
`,
    },
  },
  validationSchema: object().shape({
    MAILER_SUBJECTS_MAGIC_LINK: string().required('"主题为必填项。'),
  }),
  misc: {
    iconKey: 'email-icon2',
    helper: `要完成设置，请将此授权回调 URL 添加到 Apple 开发者控制台中的应用配置中。
            [了解更多信息](https://supabase.com/docs/guides/auth/auth-apple#configure-your-services-id)`,
  },
}

export const EMAIL_CHANGE: FormSchema = {
  $schema: JSON_SCHEMA_VERSION,
  id: 'EMAIL_CHANGE',
  type: 'object',
  title: '更改邮箱地址',
  properties: {
    MAILER_SUBJECTS_EMAIL_CHANGE: {
      title: '主题',
      type: 'string',
    },
    MAILER_TEMPLATES_EMAIL_CHANGE_CONTENT: {
      title: '邮件正文',
      descriptionOptional: '电子邮件的 HTML 正文',
      type: 'code',
      description: ` 
- \`{{ .ConfirmationURL }}\` : 用于确认电子邮件更改的URL
`,
    },
  },
  validationSchema: object().shape({
    MAILER_SUBJECTS_EMAIL_CHANGE: string().required('"主题为必填项。'),
  }),
  misc: {
    iconKey: 'email-icon2',
    helper: `要完成设置，请将此授权回调 URL 添加到 Apple 开发者控制台中的应用配置中。
            [了解更多信息](https://supabase.com/docs/guides/auth/auth-apple#configure-your-services-id)`,
  },
}

export const RECOVERY: FormSchema = {
  $schema: JSON_SCHEMA_VERSION,
  id: 'RECOVERY',
  type: 'object',
  title: '重置密码',
  properties: {
    MAILER_SUBJECTS_RECOVERY: {
      title: '主题',
      type: 'string',
    },
    MAILER_TEMPLATES_RECOVERY_CONTENT: {
      title: '邮件正文',
      descriptionOptional: '电子邮件的 HTML 正文',
      type: 'code',
      description: ` 
- \`{{ .ConfirmationURL }}\` : 用于确认密码重置的 URL
`,
    },
  },
  validationSchema: object().shape({
    MAILER_SUBJECTS_RECOVERY: string().required('"主题为必填项。'),
  }),
  misc: {
    iconKey: 'email-icon2',
    helper: `要完成设置，请将此授权回调 URL 添加到 Apple 开发者控制台中的应用配置中。
            [了解更多信息](https://supabase.com/docs/guides/auth/auth-apple#configure-your-services-id)`,
  },
}

export const TEMPLATES_SCHEMAS = [CONFIRMATION, INVITE, MAGIC_LINK, EMAIL_CHANGE, RECOVERY]
