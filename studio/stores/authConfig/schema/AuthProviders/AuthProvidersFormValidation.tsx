import { boolean, number, object, string } from 'yup'
import { domainRegex } from 'components/interfaces/Auth/Auth.constants'

const JSON_SCHEMA_VERSION = 'http://json-schema.org/draft-07/schema#'

const PROVIDER_EMAIL = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'Email',
  properties: {
    EXTERNAL_EMAIL_ENABLED: {
      title: '启用电子邮件服务商',
      description: '这将为您的应用程序启用基于电子邮件的注册和登录',
      type: 'boolean',
    },
    MAILER_AUTOCONFIRM: {
      title: '确认邮件',
      description: `用户在首次登录之前需要确认其电子邮件地址。`,
      type: 'boolean',
    },
    MAILER_SECURE_EMAIL_CHANGE_ENABLED: {
      title: '安全修改邮箱',
      description: `用户将需要在旧邮箱和新邮箱上确认邮箱变更。如果禁用，则只需新邮箱中进行确认。`,
      type: 'boolean',
    },
    MAILER_OTP_EXP: {
      title: 'OTP过期时间',
      type: 'number',
      description: '邮件 OTP 链接过期之前的持续时间。',
      units: 'seconds',
    },
    PASSWORD_MIN_LENGTH: {
      title: '最小密码长度',
      description: '用户将无法使用比这短的密码。',
      type: 'number',
    },
  },
  validationSchema: object().shape({
    PASSWORD_MIN_LENGTH: number()
      .required('密码是必填项。')
      .min(6, '密码长度必须至少为 6 个字符'),
    MAILER_OTP_EXP: number()
      .min(0, '必须大于 0')
      .max(86400, '不得超过 86400')
      .required('这是必填项'),
  }),
  misc: {
    iconKey: 'email-icon2',
    helper: `要完成设置，请将此授权回调 URL 添加到 Apple 开发者控制台的应用配置中。[了解更多](https://supabase.com/docs/guides/auth/auth-apple#configure-your-services-id)`,
  },
}

const PROVIDER_PHONE = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: '电话',
  properties: {
    EXTERNAL_PHONE_ENABLED: {
      title: '启用电话服务商',
      description: '这将为您的应用程序启用基于电话的登录',
      type: 'boolean',
    },
    SMS_PROVIDER: {
      type: 'select',
      title: '短信（SMS）服务商',
      description: '将处理发送短信的外部服务商',
      enum: [
        { label: 'Twilio', value: 'twilio', icon: 'twilio-icon.svg' },
        { label: 'Messagebird', value: 'messagebird', icon: 'messagebird-icon.svg' },
        { label: 'Textlocal', value: 'textlocal', icon: 'textlocal-icon.png' },
        { label: 'Vonage', value: 'vonage', icon: 'vonage-icon.svg' },
      ],
    },

    // Twilio
    SMS_TWILIO_ACCOUNT_SID: {
      type: 'string',
      title: 'Twilio Account Sid',
      show: {
        key: 'SMS_PROVIDER',
        matches: 'twilio',
      },
    },
    SMS_TWILIO_AUTH_TOKEN: {
      type: 'string',
      title: 'Twilio Auth Token',
      isSecret: true,
      show: {
        key: 'SMS_PROVIDER',
        matches: 'twilio',
      },
    },
    SMS_TWILIO_MESSAGE_SERVICE_SID: {
      type: 'string',
      title: 'Twilio Message Service Sid',
      show: {
        key: 'SMS_PROVIDER',
        matches: 'twilio',
      },
    },

    // Messagebird
    SMS_MESSAGEBIRD_ACCESS_KEY: {
      type: 'string',
      title: 'Messagebird Access Key',
      show: {
        key: 'SMS_PROVIDER',
        matches: 'messagebird',
      },
    },
    SMS_MESSAGEBIRD_ORIGINATOR: {
      type: 'string',
      title: 'Messagebird Originator',
      show: {
        key: 'SMS_PROVIDER',
        matches: 'messagebird',
      },
    },

    // Textloczl
    SMS_TEXTLOCAL_API_KEY: {
      type: 'string',
      title: 'Textlocal API Key',
      show: {
        key: 'SMS_PROVIDER',
        matches: 'textlocal',
      },
    },
    SMS_TEXTLOCAL_SENDER: {
      type: 'string',
      title: 'Textlocal Sender',
      show: {
        key: 'SMS_PROVIDER',
        matches: 'textlocal',
      },
    },

    // Vonage
    SMS_VONAGE_API_KEY: {
      type: 'string',
      title: 'Vonage API Key',
      show: {
        key: 'SMS_PROVIDER',
        matches: 'vonage',
      },
    },
    SMS_VONAGE_API_SECRET: {
      type: 'string',
      title: 'Vonage API Secret',
      show: {
        key: 'SMS_PROVIDER',
        matches: 'vonage',
      },
    },
    // [TODO] verify what this is?
    SMS_VONAGE_FROM: {
      type: 'string',
      title: 'Vonage From',
      show: {
        key: 'SMS_PROVIDER',
        matches: 'vonage',
      },
    },

    // SMS Confirm settings
    SMS_AUTOCONFIRM: {
      title: '启用电话确认',
      type: 'boolean',
      description: '用户需要在登录前确认其电话号码。',
    },

    SMS_OTP_EXP: {
      title: 'SMS OTP 有效期',
      type: 'number',
      description: '短信一次性密码有效期',
      units: '秒',
    },
    SMS_OTP_LENGTH: {
      title: 'SMS OTP 长度',
      type: 'number',
      description: '一次性密码的位数',
      units: '位',
    },
    SMS_TEMPLATE: {
      title: 'SMS 消息',
      type: 'string',
      description: '使用`{{ .Code }}`格式化OTP密码',
    },
  },
  validationSchema: object().shape({
    EXTERNAL_PHONE_ENABLED: boolean().required(),
    SMS_PROVIDER: string().required(),

    // Twilio
    SMS_TWILIO_ACCOUNT_SID: string().when(['EXTERNAL_PHONE_ENABLED', 'SMS_PROVIDER'], {
      is: (EXTERNAL_PHONE_ENABLED: boolean, SMS_PROVIDER: string) => {
        return EXTERNAL_PHONE_ENABLED && SMS_PROVIDER === 'twilio'
      },
      then: (schema) => schema.required('Twilio Account SID 是必填项'),
      otherwise: (schema) => schema,
    }),
    SMS_TWILIO_AUTH_TOKEN: string().when(['EXTERNAL_PHONE_ENABLED', 'SMS_PROVIDER'], {
      is: (EXTERNAL_PHONE_ENABLED: boolean, SMS_PROVIDER: string) => {
        return EXTERNAL_PHONE_ENABLED && SMS_PROVIDER === 'twilio'
      },
      then: (schema) => schema.required('Twilio Auth Token 是必填项'),
      otherwise: (schema) => schema,
    }),
    SMS_TWILIO_MESSAGE_SERVICE_SID: string().when(['EXTERNAL_PHONE_ENABLED', 'SMS_PROVIDER'], {
      is: (EXTERNAL_PHONE_ENABLED: boolean, SMS_PROVIDER: string) => {
        return EXTERNAL_PHONE_ENABLED && SMS_PROVIDER === 'twilio'
      },
      then: (schema) => schema.required('Twilio Message Service SID 是必填项'),
      otherwise: (schema) => schema,
    }),

    // Messagebird
    SMS_MESSAGEBIRD_ACCESS_KEY: string().when(['EXTERNAL_PHONE_ENABLED', 'SMS_PROVIDER'], {
      is: (EXTERNAL_PHONE_ENABLED: boolean, SMS_PROVIDER: string) => {
        return EXTERNAL_PHONE_ENABLED && SMS_PROVIDER === 'messagebird'
      },
      then: (schema) => schema.required('Messagebird Access Key 是必填项'),
      otherwise: (schema) => schema,
    }),
    SMS_MESSAGEBIRD_ORIGINATOR: string().when(['EXTERNAL_PHONE_ENABLED', 'SMS_PROVIDER'], {
      is: (EXTERNAL_PHONE_ENABLED: boolean, SMS_PROVIDER: string) => {
        return EXTERNAL_PHONE_ENABLED && SMS_PROVIDER === 'messagebird'
      },
      then: (schema) => schema.required('Messagebird Originator 是必填项'),
      otherwise: (schema) => schema,
    }),

    // Textlocal
    SMS_TEXTLOCAL_API_KEY: string().when(['EXTERNAL_PHONE_ENABLED', 'SMS_PROVIDER'], {
      is: (EXTERNAL_PHONE_ENABLED: boolean, SMS_PROVIDER: string) => {
        return EXTERNAL_PHONE_ENABLED && SMS_PROVIDER === 'textlocal'
      },
      then: (schema) => schema.required('Textlocal API Key 是必填项'),
      otherwise: (schema) => schema,
    }),
    SMS_TEXTLOCAL_SENDER: string().when(['EXTERNAL_PHONE_ENABLED', 'SMS_PROVIDER'], {
      is: (EXTERNAL_PHONE_ENABLED: boolean, SMS_PROVIDER: string) => {
        return EXTERNAL_PHONE_ENABLED && SMS_PROVIDER === 'textlocal'
      },
      then: (schema) => schema.required('Textlocal Sender 是必填项'),
      otherwise: (schema) => schema,
    }),

    // Vonage
    SMS_VONAGE_API_KEY: string().when(['EXTERNAL_PHONE_ENABLED', 'SMS_PROVIDER'], {
      is: (EXTERNAL_PHONE_ENABLED: boolean, SMS_PROVIDER: string) => {
        return EXTERNAL_PHONE_ENABLED && SMS_PROVIDER === 'vonage'
      },
      then: (schema) => schema.required('Vonage API 是必填项'),
      otherwise: (schema) => schema,
    }),
    SMS_VONAGE_API_SECRET: string().when(['EXTERNAL_PHONE_ENABLED', 'SMS_PROVIDER'], {
      is: (EXTERNAL_PHONE_ENABLED: boolean, SMS_PROVIDER: string) => {
        return EXTERNAL_PHONE_ENABLED && SMS_PROVIDER === 'vonage'
      },
      then: (schema) => schema.required('Vonage API Secret 是必填项'),
      otherwise: (schema) => schema,
    }),
    SMS_VONAGE_FROM: string().when(['EXTERNAL_PHONE_ENABLED', 'SMS_PROVIDER'], {
      is: (EXTERNAL_PHONE_ENABLED: boolean, SMS_PROVIDER: string) => {
        return EXTERNAL_PHONE_ENABLED && SMS_PROVIDER === 'vonage'
      },
      then: (schema) => schema.required('Vonage From 是必填项'),
      otherwise: (schema) => schema,
    }),

    // Phone SMS
    SMS_OTP_EXP: number().min(0, 'Must be more than 0').required('This 是必填项'),
    SMS_OTP_LENGTH: number().min(6, 'Must be 6 or more in length').required('This 是必填项'),
    SMS_TEMPLATE: string().required('SMS template 是必填项.'),
  }),
  misc: {
    iconKey: 'phone-icon4',
    helper: `To complete setup, add this authorisation callback URL to your app's configuration in the Apple Developer Console.
            [Learn more](https://supabase.com/docs/guides/auth/auth-apple#configure-your-services-id)`,
  },
}

const EXTERNAL_PROVIDER_APPLE = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'Apple',
  properties: {
    EXTERNAL_APPLE_ENABLED: {
      title: '启用Apple服务商',
      description: '这将为您的应用程序启用 Apple 登录',
      type: 'boolean',
    },
    EXTERNAL_APPLE_CLIENT_ID: {
      /**
       * to do: change docs
       */
      title: '服务ID',
      description: `
对用户进行身份验证时的客户端标识符。
[了解更多](https://developer.apple.com/documentation/sign_in_with_apple/configuring_your_environment_for_sign_in_with_apple)`,
      type: 'string',
    },
    EXTERNAL_APPLE_SECRET: {
      /**
       * to do: change docs
       */
      title: 'Secret key',
      description: `
密钥是必须生成的 JWT 令牌。
[了解更多](https://supabase.com/docs/guides/auth/auth-apple#generate-a-client_secret)`,
      type: 'string',
      isSecret: true,
    },
  },
  validationSchema: object().shape({
    EXTERNAL_APPLE_ENABLED: boolean().required(),
    EXTERNAL_APPLE_CLIENT_ID: string().when('EXTERNAL_APPLE_ENABLED', {
      is: true,
      then: (schema) => schema.required('服务ID为必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_APPLE_SECRET: string().when('EXTERNAL_APPLE_ENABLED', {
      is: true,
      then: (schema) => schema.required('Secret key是必填项'),
      otherwise: (schema) => schema,
    }),
  }),
  misc: {
    iconKey: 'apple-icon',
    requiresRedirect: true,
    helper: `要完成设置，请将此授权回调 URL 添加到 Apple 开发者控制台中的应用配置中。
            [了解更多](https://supabase.com/docs/guides/auth/auth-apple#configure-your-services-id)`,
    alert: {
      title: `Apple 密钥将每6个月自行过期一次`,
      description: `您需要在6个月之内重新生成，否则使用 Apple 登陆的用户将无法再重新登录。`,
    },
  },
}

const EXTERNAL_PROVIDER_AZURE = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'Azure',
  properties: {
    EXTERNAL_AZURE_ENABLED: {
      title: '启用Azure',
      type: 'boolean',
    },
    EXTERNAL_AZURE_CLIENT_ID: {
      // [TODO] Change docs
      title: '应用程序（客户端）ID',
      type: 'string',
    },
    EXTERNAL_AZURE_SECRET: {
      // [TODO] Change docs
      title: 'Secret Value',
      description: `输入Value而不是Secret ID.[了解更多](https://supabase.com/docs/guides/auth/auth-azure#obtain-a-secret-id)`,
      type: 'string',
      isSecret: true,
    },
    EXTERNAL_AZURE_URL: {
      // [TODO] Change docs
      title: 'Azure Tenant URL',
      descriptionOptional: '可选的',
      type: 'string',
    },
  },
  validationSchema: object().shape({
    EXTERNAL_AZURE_ENABLED: boolean().required(),
    EXTERNAL_AZURE_CLIENT_ID: string().when('EXTERNAL_AZURE_ENABLED', {
      is: true,
      then: (schema) => schema.required('应用程序（客户端）ID 是必填的'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_AZURE_SECRET: string().when('EXTERNAL_AZURE_ENABLED', {
      is: true,
      then: (schema) => schema.required('Secret ID 是必填的'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_AZURE_URL: string().matches(domainRegex, '必须是有效的URL').optional(),
  }),
  misc: {
    iconKey: 'microsoft-icon',
    requiresRedirect: true,
  },
}

const EXTERNAL_PROVIDER_BITBUCKET = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'Bitbucket',
  properties: {
    EXTERNAL_BITBUCKET_ENABLED: {
      title: '启用Bitbucket',
      type: 'boolean',
    },
    EXTERNAL_BITBUCKET_CLIENT_ID: {
      title: 'Key',
      type: 'string',
    },
    EXTERNAL_BITBUCKET_SECRET: {
      title: 'Secret',
      type: 'string',
      isSecret: true,
    },
  },
  validationSchema: object().shape({
    EXTERNAL_BITBUCKET_ENABLED: boolean().required(),
    EXTERNAL_BITBUCKET_CLIENT_ID: string().when('EXTERNAL_BITBUCKET_ENABLED', {
      is: true,
      then: (schema) => schema.required('Key是必填的'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_BITBUCKET_SECRET: string().when('EXTERNAL_BITBUCKET_ENABLED', {
      is: true,
      then: (schema) => schema.required('Secret是必填的'),
      otherwise: (schema) => schema,
    }),
  }),
  misc: {
    iconKey: 'bitbucket-icon',
    requiresRedirect: true,
  },
}

const EXTERNAL_PROVIDER_DISCORD = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'Discord',
  properties: {
    EXTERNAL_DISCORD_ENABLED: {
      title: '启用Discord',
      type: 'boolean',
    },
    EXTERNAL_DISCORD_CLIENT_ID: {
      title: 'Client ID',
      type: 'string',
    },
    EXTERNAL_DISCORD_SECRET: {
      title: 'Client Secret',
      type: 'string',
      isSecret: true,
    },
  },
  validationSchema: object().shape({
    EXTERNAL_DISCORD_ENABLED: boolean().required(),
    EXTERNAL_DISCORD_CLIENT_ID: string().when('EXTERNAL_DISCORD_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client ID为必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_DISCORD_SECRET: string().when('EXTERNAL_DISCORD_ENABLED', {
      is: true,
      then: (schema) => schema.required('客户端Secret是必填项'),
      otherwise: (schema) => schema,
    }),
  }),
  misc: {
    iconKey: 'discord-icon',
    requiresRedirect: true,
  },
}

const EXTERNAL_PROVIDER_FACEBOOK = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'Facebook',
  properties: {
    EXTERNAL_FACEBOOK_ENABLED: {
      title: '启用Facebook',
      type: 'boolean',
    },
    EXTERNAL_FACEBOOK_CLIENT_ID: {
      title: 'Facebook client ID',
      type: 'string',
    },
    EXTERNAL_FACEBOOK_SECRET: {
      title: 'Facebook secret',
      type: 'string',
      isSecret: true,
    },
  },
  validationSchema: object().shape({
    EXTERNAL_FACEBOOK_ENABLED: boolean().required(),
    EXTERNAL_FACEBOOK_CLIENT_ID: string().when('EXTERNAL_FACEBOOK_ENABLED', {
      is: true,
      then: (schema) => schema.required('"Facebook client ID"是必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_FACEBOOK_SECRET: string().when('EXTERNAL_FACEBOOK_ENABLED', {
      is: true,
      then: (schema) => schema.required('"Facebook secret"是必填项'),
      otherwise: (schema) => schema,
    }),
  }),
  misc: {
    iconKey: 'facebook-icon',
    requiresRedirect: true,
  },
}

const EXTERNAL_PROVIDER_GITHUB = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'GitHub',
  properties: {
    EXTERNAL_GITHUB_ENABLED: {
      title: '启用GitHub',
      type: 'boolean',
    },
    EXTERNAL_GITHUB_CLIENT_ID: {
      title: 'Client ID',
      type: 'string',
    },
    EXTERNAL_GITHUB_SECRET: {
      title: 'Client Secret',
      type: 'string',
      isSecret: true,
    },
  },
  validationSchema: object().shape({
    EXTERNAL_GITHUB_ENABLED: boolean().required(),
    EXTERNAL_GITHUB_CLIENT_ID: string().when('EXTERNAL_GITHUB_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client ID 是必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_GITHUB_SECRET: string().when('EXTERNAL_GITHUB_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client Secret 是必填项'),
      otherwise: (schema) => schema,
    }),
  }),
  misc: {
    iconKey: 'github-icon',
    requiresRedirect: true,
  },
}

const EXTERNAL_PROVIDER_GITLAB = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'GitLab',
  properties: {
    EXTERNAL_GITLAB_ENABLED: {
      title: '启用GitLab',
      type: 'boolean',
    },
    // [TODO] Update docs
    EXTERNAL_GITLAB_CLIENT_ID: {
      title: 'Application ID',
      type: 'string',
    },
    // [TODO] Update docs
    EXTERNAL_GITLAB_SECRET: {
      title: 'Secret',
      type: 'string',
      isSecret: true,
    },
    EXTERNAL_GITLAB_URL: {
      title: '自托管的 GitLab URL',
      descriptionOptional: '可选的',
      type: 'string',
    },
  },
  validationSchema: object().shape({
    EXTERNAL_GITLAB_ENABLED: boolean().required(),
    EXTERNAL_GITLAB_CLIENT_ID: string().when('EXTERNAL_GITLAB_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client ID 是必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_GITLAB_SECRET: string().when('EXTERNAL_GITLAB_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client Secret 是必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_GITLAB_URL: string().matches(domainRegex, '必须是有效的URL').optional(),
  }),
  misc: {
    iconKey: 'gitlab-icon',
    requiresRedirect: true,
  },
}

const EXTERNAL_PROVIDER_GOOGLE = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'Google',
  properties: {
    EXTERNAL_GOOGLE_ENABLED: {
      title: '启用Google',
      type: 'boolean',
    },
    // [TODO] Update docs
    EXTERNAL_GOOGLE_CLIENT_ID: {
      title: 'Client ID',
      type: 'string',
    },
    // [TODO] Update docs
    EXTERNAL_GOOGLE_SECRET: {
      title: 'Client Secret',
      type: 'string',
      isSecret: true,
    },
  },
  validationSchema: object().shape({
    EXTERNAL_GOOGLE_ENABLED: boolean().required(),
    EXTERNAL_GOOGLE_CLIENT_ID: string().when('EXTERNAL_GOOGLE_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client ID 是必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_GOOGLE_SECRET: string().when('EXTERNAL_GOOGLE_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client Secret 是必填项'),
      otherwise: (schema) => schema,
    }),
  }),
  misc: {
    iconKey: 'google-icon',
    requiresRedirect: true,
  },
}

// [TODO]: clarify the EXTERNAL_KEYCLOAK_URL property
const EXTERNAL_PROVIDER_KEYCLOAK = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'KeyCloak',
  properties: {
    EXTERNAL_KEYCLOAK_ENABLED: {
      title: '启用Keycloak',
      type: 'boolean',
    },
    EXTERNAL_KEYCLOAK_CLIENT_ID: {
      title: 'Client ID',
      type: 'string',
    },
    EXTERNAL_KEYCLOAK_SECRET: {
      title: 'Secret',
      type: 'string',
      isSecret: true,
    },
    EXTERNAL_KEYCLOAK_URL: {
      title: 'Realm URL',
      description: '',
      type: 'string',
    },
  },
  validationSchema: object().shape({
    EXTERNAL_KEYCLOAK_ENABLED: boolean().required(),
    EXTERNAL_KEYCLOAK_CLIENT_ID: string().when('EXTERNAL_KEYCLOAK_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client ID 是必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_KEYCLOAK_SECRET: string().when('EXTERNAL_KEYCLOAK_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client secret 是必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_KEYCLOAK_URL: string().when('EXTERNAL_KEYCLOAK_ENABLED', {
      is: true,
      then: (schema) =>
        schema.matches(domainRegex, '必须是有效的URL').required('Realm URL 是必填项'),
      otherwise: (schema) => schema.matches(domainRegex, '必须是有效的URL'),
    }),
  }),
  misc: {
    iconKey: 'keycloak-icon',
    requiresRedirect: true,
  },
}

const EXTERNAL_PROVIDER_LINKEDIN = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'LinkedIn',
  properties: {
    EXTERNAL_LINKEDIN_ENABLED: {
      title: '启用Linkedin',
      type: 'boolean',
    },
    // [TODO] Update docs
    EXTERNAL_LINKEDIN_CLIENT_ID: {
      title: 'API Key',
      type: 'string',
    },
    // [TODO] Update docs
    EXTERNAL_LINKEDIN_SECRET: {
      title: 'API Secret Key',
      type: 'string',
      isSecret: true,
    },
  },
  validationSchema: object().shape({
    EXTERNAL_LINKEDIN_ENABLED: boolean().required(),
    EXTERNAL_LINKEDIN_CLIENT_ID: string().when('EXTERNAL_LINKEDIN_ENABLED', {
      is: true,
      then: (schema) => schema.required('API Key 是必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_LINKEDIN_SECRET: string().when('EXTERNAL_LINKEDIN_ENABLED', {
      is: true,
      then: (schema) => schema.required('API Secret Key 是必填项'),
      otherwise: (schema) => schema,
    }),
  }),
  misc: {
    iconKey: 'linkedin-icon',
    requiresRedirect: true,
  },
}

const EXTERNAL_PROVIDER_NOTION = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'Notion',
  properties: {
    EXTERNAL_NOTION_ENABLED: {
      title: '启用Notion',
      type: 'boolean',
    },
    EXTERNAL_NOTION_CLIENT_ID: {
      title: 'OAuth client ID',
      type: 'string',
    },
    EXTERNAL_NOTION_SECRET: {
      title: 'OAuth client secret',
      type: 'string',
      isSecret: true,
    },
  },
  validationSchema: object().shape({
    EXTERNAL_NOTION_ENABLED: boolean().required(),
    EXTERNAL_NOTION_CLIENT_ID: string().when('EXTERNAL_NOTION_ENABLED', {
      is: true,
      then: (schema) => schema.required('OAuth client ID 是必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_NOTION_SECRET: string().when('EXTERNAL_NOTION_ENABLED', {
      is: true,
      then: (schema) => schema.required('OAuth client secret 是必填项'),
      otherwise: (schema) => schema,
    }),
  }),
  misc: {
    iconKey: 'notion-icon',
    requiresRedirect: true,
  },
}

const EXTERNAL_PROVIDER_TWITCH = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'Twitch',
  properties: {
    EXTERNAL_TWITCH_ENABLED: {
      title: '启用Twitch',
      type: 'boolean',
    },
    EXTERNAL_TWITCH_CLIENT_ID: {
      title: 'Client ID',
      type: 'string',
    },
    EXTERNAL_TWITCH_SECRET: {
      title: 'Client secret',
      type: 'string',
      isSecret: true,
    },
  },
  validationSchema: object().shape({
    EXTERNAL_TWITCH_ENABLED: boolean().required(),
    EXTERNAL_TWITCH_CLIENT_ID: string().when('EXTERNAL_TWITCH_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client ID 是必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_TWITCH_SECRET: string().when('EXTERNAL_TWITCH_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client secret 是必填项'),
      otherwise: (schema) => schema,
    }),
  }),
  misc: {
    iconKey: 'twitch-icon',
    requiresRedirect: true,
  },
}

const EXTERNAL_PROVIDER_TWITTER = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'Twitter',
  properties: {
    EXTERNAL_TWITTER_ENABLED: {
      title: '启用Twitter',
      type: 'boolean',
    },
    EXTERNAL_TWITTER_CLIENT_ID: {
      title: 'API Key',
      type: 'string',
    },
    EXTERNAL_TWITTER_SECRET: {
      title: 'API Secret Key',
      type: 'string',
      isSecret: true,
    },
  },
  validationSchema: object().shape({
    EXTERNAL_TWITTER_ENABLED: boolean().required(),
    EXTERNAL_TWITTER_CLIENT_ID: string().when('EXTERNAL_TWITTER_ENABLED', {
      is: true,
      then: (schema) => schema.required('API Key 是必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_TWITTER_SECRET: string().when('EXTERNAL_TWITTER_ENABLED', {
      is: true,
      then: (schema) => schema.required('API Secret Key 是必填项'),
      otherwise: (schema) => schema,
    }),
  }),
  misc: {
    iconKey: 'twitter-icon',
    requiresRedirect: true,
  },
}

const EXTERNAL_PROVIDER_SLACK = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'Slack',
  properties: {
    EXTERNAL_SLACK_ENABLED: {
      title: '启用Slack',
      type: 'boolean',
    },
    EXTERNAL_SLACK_CLIENT_ID: {
      title: 'Client ID',
      type: 'string',
    },
    EXTERNAL_SLACK_SECRET: {
      title: 'Client Secret',
      type: 'string',
      isSecret: true,
    },
  },
  validationSchema: object().shape({
    EXTERNAL_SLACK_ENABLED: boolean().required(),
    EXTERNAL_SLACK_CLIENT_ID: string().when('EXTERNAL_SLACK_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client ID 是必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_SLACK_SECRET: string().when('EXTERNAL_SLACK_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client Secret 是必填项'),
      otherwise: (schema) => schema,
    }),
  }),
  misc: {
    iconKey: 'slack-icon',
    requiresRedirect: true,
  },
}

const EXTERNAL_PROVIDER_SPOTIFY = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'Spotify',
  properties: {
    EXTERNAL_SPOTIFY_ENABLED: {
      title: '启用Spotify',
      type: 'boolean',
    },
    EXTERNAL_SPOTIFY_CLIENT_ID: {
      title: 'Client ID',
      type: 'string',
    },
    EXTERNAL_SPOTIFY_SECRET: {
      title: 'Client Secret',
      type: 'string',
      isSecret: true,
    },
  },
  validationSchema: object().shape({
    EXTERNAL_SPOTIFY_ENABLED: boolean().required(),
    EXTERNAL_SPOTIFY_CLIENT_ID: string().when('EXTERNAL_SPOTIFY_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client ID 是必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_SPOTIFY_SECRET: string().when('EXTERNAL_SPOTIFY_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client Secret 是必填项'),
      otherwise: (schema) => schema,
    }),
  }),
  misc: {
    iconKey: 'spotify-icon',
    requiresRedirect: true,
  },
}

const EXTERNAL_PROVIDER_WORKOS = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'WorkOS',
  properties: {
    EXTERNAL_WORKOS_ENABLED: {
      title: '启用WorkOS',
      type: 'boolean',
    },
    EXTERNAL_WORKOS_URL: {
      title: 'WorkOS URL',
      type: 'string',
    },
    EXTERNAL_WORKOS_CLIENT_ID: {
      title: 'Client ID',
      type: 'string',
    },
    EXTERNAL_WORKOS_SECRET: {
      title: 'Secret Key',
      type: 'string',
      isSecret: true,
    },
  },
  validationSchema: object().shape({
    EXTERNAL_WORKOS_ENABLED: boolean().required(),
    EXTERNAL_WORKOS_URL: string()
      .matches(domainRegex, '必须是有效的URL')
      .when('EXTERNAL_WORKOS_ENABLED', {
        is: true,
        then: (schema) => schema.required('WorkOS URL 是必填项'),
        otherwise: (schema) => schema,
      }),
    EXTERNAL_WORKOS_CLIENT_ID: string().when('EXTERNAL_WORKOS_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client ID 是必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_WORKOS_SECRET: string().when('EXTERNAL_WORKOS_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client Secret 是必填项'),
      otherwise: (schema) => schema,
    }),
  }),
  misc: {
    iconKey: 'workos-icon',
    requiresRedirect: true,
  },
}

const EXTERNAL_PROVIDER_ZOOM = {
  $schema: JSON_SCHEMA_VERSION,
  type: 'object',
  title: 'Zoom',
  properties: {
    EXTERNAL_ZOOM_ENABLED: {
      title: '启用Zoom',
      type: 'boolean',
    },
    EXTERNAL_ZOOM_CLIENT_ID: {
      title: 'Client ID',
      type: 'string',
    },
    EXTERNAL_ZOOM_SECRET: {
      title: 'Client secret',
      type: 'string',
      isSecret: true,
    },
  },
  validationSchema: object().shape({
    EXTERNAL_ZOOM_ENABLED: boolean().required(),
    EXTERNAL_ZOOM_CLIENT_ID: string().when('EXTERNAL_ZOOM_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client ID 是必填项'),
      otherwise: (schema) => schema,
    }),
    EXTERNAL_ZOOM_SECRET: string().when('EXTERNAL_ZOOM_ENABLED', {
      is: true,
      then: (schema) => schema.required('Client secret 是必填项'),
      otherwise: (schema) => schema,
    }),
  }),
  misc: {
    iconKey: 'zoom-icon',
    requiresRedirect: true,
  },
}

export const OLD = {
  type: 'object',
  required: [
    'SITE_URL',
    'DISABLE_SIGNUP',
    'JWT_EXP',
    'JWT_AUD',
    'JWT_DEFAULT_GROUP_NAME',
    'SECURITY_UPDATE_PASSWORD_REQUIRE_REAUTHENTICATION',
    'EXTERNAL_EMAIL_ENABLED',
    'EXTERNAL_PHONE_ENABLED',
    'EXTERNAL_APPLE_ENABLED',
    'EXTERNAL_AZURE_ENABLED',
    'EXTERNAL_BITBUCKET_ENABLED',
    'EXTERNAL_DISCORD_ENABLED',
    'EXTERNAL_FACEBOOK_ENABLED',
    'EXTERNAL_GITHUB_ENABLED',
    'EXTERNAL_GITLAB_ENABLED',
    'EXTERNAL_GOOGLE_ENABLED',
    'EXTERNAL_KEYCLOAK_ENABLED',
    'EXTERNAL_LINKEDIN_ENABLED',
    'EXTERNAL_NOTION_ENABLED',
    'EXTERNAL_TWITCH_ENABLED',
    'EXTERNAL_TWITTER_ENABLED',
    'EXTERNAL_SLACK_ENABLED',
    'EXTERNAL_SPOTIFY_ENABLED',
    'EXTERNAL_WORKOS_ENABLED',
    'EXTERNAL_ZOOM_ENABLED',
    'SMS_AUTOCONFIRM',
    'SMS_MAX_FREQUENCY',
    'SMS_OTP_EXP',
    'SMS_OTP_LENGTH',
    'SMS_PROVIDER',
    'SMS_TEMPLATE',
    'MAILER_AUTOCONFIRM',
    'MAILER_URLPATHS_INVITE',
    'MAILER_URLPATHS_CONFIRMATION',
    'MAILER_URLPATHS_RECOVERY',
    'MAILER_URLPATHS_EMAIL_CHANGE',
    'MAILER_SUBJECTS_INVITE',
    'MAILER_SUBJECTS_CONFIRMATION',
    'MAILER_SUBJECTS_RECOVERY',
    'MAILER_SUBJECTS_MAGIC_LINK',
    'MAILER_SUBJECTS_EMAIL_CHANGE',
    'MAILER_TEMPLATES_INVITE_CONTENT',
    'MAILER_TEMPLATES_CONFIRMATION_CONTENT',
    'MAILER_TEMPLATES_RECOVERY_CONTENT',
    'MAILER_TEMPLATES_MAGIC_LINK_CONTENT',
    'MAILER_TEMPLATES_EMAIL_CHANGE_CONTENT',
  ],
  properties: {
    SITE_URL: {
      title: 'Site URL',
      type: 'string',
      help: 'The base URL of your website. Used as an allow-list for redirects and for constructing URLs used in emails.',
    },
    URI_ALLOW_LIST: {
      title: 'Additional redirect URLs',
      type: 'string',
      help: 'A comma separated list of *exact* URLs that auth providers are permitted to redirect to post authentication.',
    },
    DISABLE_SIGNUP: {
      title: 'Disable signup',
      type: 'boolean',
      help: 'Allow/disallow new user signups to your project.',
    },
    EXTERNAL_EMAIL_ENABLED: {
      title: 'Enable email signup',
      type: 'boolean',
      help: 'Allow/disallow new user signups via email to your project.',
    },
    EXTERNAL_PHONE_ENABLED: {
      title: 'Enable phone signup',
      type: 'boolean',
      help: 'Allow/disallow new user signups via phone to your project.',
    },
    JWT_EXP: {
      title: 'JWT expiry',
      type: 'integer',
      help: 'How long tokens are valid for, in seconds. Defaults to 3600 (1 hour), maximum 604,800 seconds (one week).',
      minimum: 1,
      maximum: 604800,
      multipleof: 1,
    },
    JWT_AUD: {
      title: 'JWT audience',
      type: 'string',
    },
    JWT_DEFAULT_GROUP_NAME: {
      title: 'Default user group',
      type: 'string',
    },
    EXTERNAL_APPLE_ENABLED: {
      title: 'Apple enabled',
      type: 'boolean',
    },
    EXTERNAL_APPLE_CLIENT_ID: {
      title: 'Apple client ID',
      type: 'string',
    },
    EXTERNAL_APPLE_SECRET: {
      title: 'Apple secret',
      type: 'string',
    },
    EXTERNAL_AZURE_ENABLED: {
      title: 'Azure enabled',
      type: 'boolean',
    },
    EXTERNAL_AZURE_CLIENT_ID: {
      title: 'Azure client ID',
      type: 'string',
    },
    EXTERNAL_AZURE_SECRET: {
      title: 'Azure secret',
      type: 'string',
    },
    EXTERNAL_AZURE_URL: {
      title: 'Azure Tenant URL',
      type: 'string',
    },
    EXTERNAL_BITBUCKET_ENABLED: {
      title: 'Bitbucket enabled',
      type: 'boolean',
    },
    EXTERNAL_BITBUCKET_CLIENT_ID: {
      title: 'Bitbucket client ID',
      type: 'string',
    },
    EXTERNAL_BITBUCKET_SECRET: {
      title: 'Bitbucket secret',
      type: 'string',
    },
    EXTERNAL_DISCORD_ENABLED: {
      title: 'Discord enabled',
      type: 'boolean',
    },
    EXTERNAL_DISCORD_CLIENT_ID: {
      title: 'Discord client ID',
      type: 'string',
    },
    EXTERNAL_DISCORD_SECRET: {
      title: 'Discord secret',
      type: 'string',
    },
    EXTERNAL_FACEBOOK_ENABLED: {
      title: 'Facebook enabled',
      type: 'boolean',
    },
    EXTERNAL_FACEBOOK_CLIENT_ID: {
      title: 'Facebook client ID',
      type: 'string',
    },
    EXTERNAL_FACEBOOK_SECRET: {
      title: 'Facebook secret',
      type: 'string',
    },
    EXTERNAL_GITHUB_ENABLED: {
      title: 'GitHub enabled',
      type: 'boolean',
    },
    EXTERNAL_GITHUB_CLIENT_ID: {
      title: 'GitHub client ID',
      type: 'string',
    },
    EXTERNAL_GITHUB_SECRET: {
      title: 'GitHub secret',
      type: 'string',
    },
    EXTERNAL_GITLAB_ENABLED: {
      title: 'GitLab enabled',
      type: 'boolean',
    },
    EXTERNAL_GITLAB_CLIENT_ID: {
      title: 'GitLab client ID',
      type: 'string',
    },
    EXTERNAL_GITLAB_SECRET: {
      title: 'Gitlab secret',
      type: 'string',
    },
    EXTERNAL_GITLAB_URL: {
      title:
        'The base URL used for constructing the URLs to request authorization and access tokens.',
      type: 'string',
    },
    EXTERNAL_GOOGLE_ENABLED: {
      title: 'Google enabled',
      type: 'boolean',
    },
    EXTERNAL_GOOGLE_CLIENT_ID: {
      title: 'Google client ID',
      type: 'string',
    },
    EXTERNAL_GOOGLE_SECRET: {
      title: 'Google secret',
      type: 'string',
    },
    EXTERNAL_KEYCLOAK_ENABLED: {
      title: 'Keycloak enabled',
      type: 'boolean',
    },
    EXTERNAL_KEYCLOAK_CLIENT_ID: {
      title: 'Keycloak client ID',
      type: 'string',
    },
    EXTERNAL_KEYCLOAK_SECRET: {
      title: 'Keycloak secret',
      type: 'string',
    },
    EXTERNAL_KEYCLOAK_URL: {
      title: 'Keycloak URL',
      type: 'string',
    },
    EXTERNAL_LINKEDIN_ENABLED: {
      title: 'Linkedin enabled',
      type: 'boolean',
    },
    EXTERNAL_LINKEDIN_CLIENT_ID: {
      title: 'Linkedin client ID',
      type: 'string',
    },
    EXTERNAL_LINKEDIN_SECRET: {
      title: 'Linkedin secret',
      type: 'string',
    },
    EXTERNAL_NOTION_ENABLED: {
      title: 'Notion enabled',
      type: 'boolean',
    },
    EXTERNAL_NOTION_CLIENT_ID: {
      title: 'Notion client ID',
      type: 'string',
    },
    EXTERNAL_NOTION_SECRET: {
      title: 'Notion secret',
      type: 'string',
    },
    EXTERNAL_TWITCH_ENABLED: {
      title: 'Twitch enabled',
      type: 'boolean',
    },
    EXTERNAL_TWITCH_CLIENT_ID: {
      title: 'Twitch client ID',
      type: 'string',
    },
    EXTERNAL_TWITCH_SECRET: {
      title: 'Twitch secret',
      type: 'string',
    },
    EXTERNAL_TWITTER_ENABLED: {
      title: 'Twitter enabled',
      type: 'boolean',
    },
    EXTERNAL_TWITTER_CLIENT_ID: {
      title: 'Twitter client ID',
      type: 'string',
    },
    EXTERNAL_TWITTER_SECRET: {
      title: 'Twitter secret',
      type: 'string',
    },
    EXTERNAL_SLACK_ENABLED: {
      title: 'Slack enabled',
      type: 'boolean',
    },
    EXTERNAL_SLACK_CLIENT_ID: {
      title: 'Slack client ID',
      type: 'string',
    },
    EXTERNAL_SLACK_SECRET: {
      title: 'Slack secret',
      type: 'string',
    },
    EXTERNAL_SPOTIFY_ENABLED: {
      title: 'Spotify enabled',
      type: 'boolean',
    },
    EXTERNAL_SPOTIFY_CLIENT_ID: {
      title: 'Spotify client ID',
      type: 'string',
    },
    EXTERNAL_SPOTIFY_SECRET: {
      title: 'Spotify secret',
      type: 'string',
    },
    EXTERNAL_WORKOS_ENABLED: {
      title: 'WorkOS enabled',
      type: 'boolean',
    },
    EXTERNAL_WORKOS_CLIENT_ID: {
      title: 'WorkOS client ID',
      type: 'string',
    },
    EXTERNAL_WORKOS_SECRET: {
      title: 'WorkOS secret',
      type: 'string',
    },
    EXTERNAL_WORKOS_URL: {
      title: 'WorkOS URL',
      type: 'string',
    },
    EXTERNAL_ZOOM_ENABLED: {
      title: 'Zoom enabled',
      type: 'boolean',
    },
    EXTERNAL_ZOOM_CLIENT_ID: {
      title: 'Zoom client ID',
      type: 'string',
    },
    EXTERNAL_ZOOM_SECRET: {
      title: 'Zoom secret',
      type: 'string',
    },
    SMTP_ADMIN_EMAIL: {
      title: 'SMTP admin email',
      type: 'string',
    },
    SMTP_HOST: {
      title: 'SMTP host',
      type: 'string',
    },
    SMTP_PORT: {
      title: 'SMTP port',
      type: 'string',
    },
    SMTP_USER: {
      title: 'SMTP user',
      type: 'string',
    },
    SMTP_PASS: {
      title: 'SMTP password',
      type: 'string',
    },
    SMTP_PASS_ENCRYPTED: {
      title: 'SMTP password',
      type: 'string',
    },
    SMTP_SENDER_NAME: {
      title: 'SMTP sender name',
      type: 'string',
    },
    RATE_LIMIT_EMAIL_SENT: {
      title: 'Rate limit',
      type: 'number',
      help: 'Maximum number of emails sent per hour (Default: 30, Max: 32,767)',
      minimum: 1,
      maximum: 32767,
      multipleof: 1,
    },
    MAILER_SECURE_EMAIL_CHANGE_ENABLED: {
      title: 'Double confirm email changes',
      type: 'boolean',
      help: 'If enabled, a user will be required to confirm any email change on both the old, and new email addresses. If disabled, only the new email 是必填项 to confirm',
    },
    MAILER_AUTOCONFIRM: {
      title: 'Enable email confirmations',
      type: 'boolean',
      help: 'If enabled, users need to confirm their email address before signing in.',
    },
    MAILER_URLPATHS_INVITE: {
      title: 'Confirmation URL',
      type: 'string',
    },
    MAILER_URLPATHS_CONFIRMATION: {
      title: 'Path',
      type: 'string',
    },
    MAILER_URLPATHS_RECOVERY: {
      title: 'Confirmation URL',
      type: 'string',
    },
    MAILER_URLPATHS_EMAIL_CHANGE: {
      title: 'Confirmation URL',
      type: 'string',
    },
    MAILER_SUBJECTS_INVITE: {
      title: 'Subject',
      type: 'string',
    },
    MAILER_SUBJECTS_CONFIRMATION: {
      title: 'Subject',
      type: 'string',
    },
    MAILER_SUBJECTS_MAGIC_LINK: {
      title: 'Subject',
      type: 'string',
    },
    MAILER_SUBJECTS_RECOVERY: {
      title: 'Subject',
      type: 'string',
    },
    MAILER_SUBJECTS_EMAIL_CHANGE: {
      title: 'Subject',
      type: 'string',
    },
    MAILER_TEMPLATES_INVITE: {
      type: 'string',
    },
    MAILER_TEMPLATES_INVITE_CONTENT: {
      title: 'Body',
      type: 'string',
    },
    MAILER_TEMPLATES_CONFIRMATION: {
      type: 'string',
    },
    MAILER_TEMPLATES_CONFIRMATION_CONTENT: {
      title: 'Body',
      type: 'string',
    },
    MAILER_TEMPLATES_RECOVERY: {
      type: 'string',
    },
    MAILER_TEMPLATES_MAGIC_LINK: {
      type: 'string',
    },
    MAILER_TEMPLATES_RECOVERY_CONTENT: {
      title: 'Body',
      type: 'string',
    },
    MAILER_TEMPLATES_MAGIC_LINK_CONTENT: {
      title: 'Body',
      type: 'string',
    },
    MAILER_TEMPLATES_EMAIL_CHANGE: {
      type: 'string',
    },
    MAILER_TEMPLATES_EMAIL_CHANGE_CONTENT: {
      title: 'Body',
      type: 'string',
    },
    PASSWORD_MIN_LENGTH: {
      title: 'Minimum password length',
      type: 'integer',
    },
    SECURITY_UPDATE_PASSWORD_REQUIRE_REAUTHENTICATION: {
      title: 'Enable strict password updates',
      type: 'boolean',
      help: 'If enabled, users need to reauthenticate via email or phone before updating their passwords.',
    },
    SMS_AUTOCONFIRM: {
      title: 'Enable phone confirmations',
      type: 'boolean',
      help: 'If enabled, users need to confirm their phone number before signing in.',
    },
    SMS_PROVIDER: {
      title: 'Sms provider',
      type: 'string',
      options: [
        {
          value: 'twilio',
          label: 'Twilio',
        },
        {
          value: 'messagebird',
          label: 'Messagebird',
        },
        {
          value: 'vonage',
          label: 'Vonage',
        },
        {
          value: 'textlocal',
          label: 'Textlocal',
        },
      ],
    },
    SMS_TEXTLOCAL_API_KEY: {
      title: 'Textlocal API key',
      type: 'string',
    },
    SMS_TEXTLOCAL_SENDER: {
      title: 'Textlocal sender',
      type: 'string',
      help: 'Textlocal sender phone number',
    },
    SMS_TWILIO_ACCOUNT_SID: {
      title: 'Twilio account SID',
      type: 'string',
    },
    SMS_TWILIO_AUTH_TOKEN: {
      title: 'Twilio auth token',
      type: 'string',
    },
    SMS_TWILIO_MESSAGE_SERVICE_SID: {
      title: 'Twilio message service SID',
      type: 'string',
      help: 'Twilio message service SID or twilio phone number',
    },
    SMS_MESSAGEBIRD_ACCESS_KEY: {
      title: 'Messagebird access key',
      type: 'string',
    },
    SMS_MESSAGEBIRD_ORIGINATOR: {
      title: 'Messagebird originator',
      type: 'string',
      help: 'Messagebird sender name or phone number',
    },
    SMS_VONAGE_API_KEY: {
      title: 'Vonage API key',
      type: 'string',
    },
    SMS_VONAGE_API_SECRET: {
      title: 'Vonage API secret',
      type: 'string',
    },
    SMS_VONAGE_FROM: {
      title: 'Vonage sender',
      type: 'string',
      help: 'Vonage sender phone number',
    },
    SMS_TEMPLATE: {
      title: 'Body',
      type: 'string',
    },
  },
}

export const PROVIDERS_SCHEMAS = [
  PROVIDER_EMAIL,
  PROVIDER_PHONE,
  EXTERNAL_PROVIDER_APPLE,
  EXTERNAL_PROVIDER_AZURE,
  EXTERNAL_PROVIDER_BITBUCKET,
  EXTERNAL_PROVIDER_DISCORD,
  EXTERNAL_PROVIDER_FACEBOOK,
  EXTERNAL_PROVIDER_GITHUB,
  EXTERNAL_PROVIDER_GITLAB,
  EXTERNAL_PROVIDER_GOOGLE,
  EXTERNAL_PROVIDER_KEYCLOAK,
  EXTERNAL_PROVIDER_LINKEDIN,
  EXTERNAL_PROVIDER_NOTION,
  EXTERNAL_PROVIDER_TWITCH,
  EXTERNAL_PROVIDER_TWITTER,
  EXTERNAL_PROVIDER_SLACK,
  EXTERNAL_PROVIDER_SPOTIFY,
  EXTERNAL_PROVIDER_WORKOS,
  EXTERNAL_PROVIDER_ZOOM,
]
