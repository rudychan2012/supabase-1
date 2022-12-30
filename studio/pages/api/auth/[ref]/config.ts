import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'
import { get, post } from '../../../../lib/common/fetch'

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

const defaultConfig = {
  app_version: 'supabase-postgres-14.1.0.76',
  config_override_id: '144444',
  project_id: '333344',
  jwt_secret_encrypted: '',
  isFreeTier: false,
  SITE_URL: 'localhost:4200',
  OPERATOR_TOKEN: null,
  DISABLE_SIGNUP: false,
  RATE_LIMIT_HEADER: null,
  JWT_EXP: 3600,
  JWT_AUD: 'authenticated',
  JWT_DEFAULT_GROUP_NAME: 'authenticated',
  URI_ALLOW_LIST: '',
  MAILER_AUTOCONFIRM: false,
  MAILER_OTP_EXP: 86400,
  MAILER_URLPATHS_INVITE: '/auth/v1/verify',
  MAILER_URLPATHS_CONFIRMATION: '/auth/v1/verify',
  MAILER_URLPATHS_RECOVERY: '/auth/v1/verify',
  MAILER_URLPATHS_EMAIL_CHANGE: '/auth/v1/verify',
  MAX_ENROLLED_FACTORS: 10,
  SECURITY_UPDATE_PASSWORD_REQUIRE_REAUTHENTICATION: false,
  SMTP_ADMIN_EMAIL: '',
  SMTP_HOST: null,
  SMTP_PORT: null,
  SMTP_USER: null,
  SMTP_PASS: null,
  SMTP_MAX_FREQUENCY: 60,
  EXTERNAL_EMAIL_ENABLED: true,
  EXTERNAL_PHONE_ENABLED: true,
  EXTERNAL_APPLE_ENABLED: false,
  EXTERNAL_APPLE_CLIENT_ID: null,
  EXTERNAL_APPLE_SECRET: null,
  EXTERNAL_AZURE_ENABLED: false,
  EXTERNAL_AZURE_CLIENT_ID: null,
  EXTERNAL_AZURE_SECRET: null,
  EXTERNAL_AZURE_URL: null,
  EXTERNAL_BITBUCKET_ENABLED: false,
  EXTERNAL_BITBUCKET_CLIENT_ID: null,
  EXTERNAL_BITBUCKET_SECRET: null,
  EXTERNAL_DISCORD_ENABLED: false,
  EXTERNAL_DISCORD_CLIENT_ID: null,
  EXTERNAL_DISCORD_SECRET: null,
  EXTERNAL_FACEBOOK_ENABLED: false,
  EXTERNAL_FACEBOOK_CLIENT_ID: null,
  EXTERNAL_FACEBOOK_SECRET: null,
  EXTERNAL_GITHUB_ENABLED: false,
  EXTERNAL_GITHUB_CLIENT_ID: null,
  EXTERNAL_GITHUB_SECRET: null,
  EXTERNAL_GITLAB_ENABLED: false,
  EXTERNAL_GITLAB_CLIENT_ID: null,
  EXTERNAL_GITLAB_SECRET: null,
  EXTERNAL_GITLAB_REDIRECT_URI: null,
  EXTERNAL_GOOGLE_ENABLED: false,
  EXTERNAL_GOOGLE_CLIENT_ID: null,
  EXTERNAL_GOOGLE_SECRET: null,
  EXTERNAL_KEYCLOAK_ENABLED: false,
  EXTERNAL_KEYCLOAK_CLIENT_ID: null,
  EXTERNAL_KEYCLOAK_SECRET: null,
  EXTERNAL_KEYCLOAK_URL: null,
  EXTERNAL_LINKEDIN_ENABLED: false,
  EXTERNAL_LINKEDIN_CLIENT_ID: null,
  EXTERNAL_LINKEDIN_SECRET: null,
  EXTERNAL_NOTION_ENABLED: false,
  EXTERNAL_NOTION_CLIENT_ID: null,
  EXTERNAL_NOTION_SECRET: null,
  EXTERNAL_SPOTIFY_ENABLED: false,
  EXTERNAL_SPOTIFY_CLIENT_ID: null,
  EXTERNAL_SPOTIFY_SECRET: null,
  EXTERNAL_SLACK_ENABLED: false,
  EXTERNAL_SLACK_CLIENT_ID: null,
  EXTERNAL_SLACK_SECRET: null,
  EXTERNAL_TWITTER_ENABLED: false,
  EXTERNAL_TWITTER_CLIENT_ID: null,
  EXTERNAL_TWITTER_SECRET: null,
  EXTERNAL_TWITCH_ENABLED: false,
  EXTERNAL_TWITCH_CLIENT_ID: null,
  EXTERNAL_TWITCH_SECRET: null,
  EXTERNAL_WORKOS_ENABLED: false,
  EXTERNAL_WORKOS_CLIENT_ID: null,
  EXTERNAL_WORKOS_SECRET: null,
  EXTERNAL_WORKOS_URL: null,
  EXTERNAL_ZOOM_ENABLED: false,
  EXTERNAL_ZOOM_CLIENT_ID: null,
  EXTERNAL_ZOOM_SECRET: null,

  MAILER_SUBJECTS_INVITE: 'You have been invited',
  MAILER_SUBJECTS_CONFIRMATION: 'Confirm Your Signup',
  MAILER_SUBJECTS_RECOVERY: 'Reset Your Password',
  MAILER_SUBJECTS_EMAIL_CHANGE: 'Confirm Email Change',
  MAILER_SUBJECTS_MAGIC_LINK: 'Your Magic Link',
  MAILER_TEMPLATES_INVITE: null,
  MAILER_TEMPLATES_INVITE_CONTENT:
    '<h2>You have been invited</h2>\n\n<p>You have been invited to create a user on {{ .SiteURL }}. Follow this link to accept the invite:</p>\n<p><a href="{{ .ConfirmationURL }}">Accept the invite</a></p>',
  MAILER_TEMPLATES_CONFIRMATION: null,
  MAILER_TEMPLATES_CONFIRMATION_CONTENT:
    '<h2>Confirm your signup</h2>\n\n<p>Follow this link to confirm your user:</p>\n<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>',
  MAILER_TEMPLATES_RECOVERY: null,
  MAILER_TEMPLATES_RECOVERY_CONTENT:
    '<h2>Reset Password</h2>\n\n<p>Follow this link to reset the password for your user:</p>\n<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>',
  MAILER_TEMPLATES_EMAIL_CHANGE: null,
  MAILER_TEMPLATES_EMAIL_CHANGE_CONTENT:
    '<h2>Confirm Change of Email</h2>\n\n<p>Follow this link to confirm the update of your email from {{ .Email }} to {{ .NewEmail }}:</p>\n<p><a href="{{ .ConfirmationURL }}">Change Email</a></p>',
  MAILER_TEMPLATES_MAGIC_LINK: null,
  MAILER_TEMPLATES_MAGIC_LINK_CONTENT:
    '<h2>Magic Link</h2>\n\n<p>Follow this link to login:</p>\n<p><a href="{{ .ConfirmationURL }}">Log In</a></p>',
  PASSWORD_MIN_LENGTH: 6,
  SMTP_SENDER_NAME: null,
  SMS_AUTOCONFIRM: false,
  SMS_MAX_FREQUENCY: 0,
  SMS_OTP_EXP: 60,
  SMS_OTP_LENGTH: 6,
  SMS_PROVIDER: 'twilio',
  SMS_TWILIO_ACCOUNT_SID: null,
  SMS_TWILIO_AUTH_TOKEN: null,
  SMS_TWILIO_MESSAGE_SERVICE_SID: null,
  SMS_TEMPLATE: 'Your code is {{ .Code }}',
  SECURITY_CAPTCHA_ENABLED: false,
  SECURITY_CAPTCHA_PROVIDER: 'hcaptcha',
  SECURITY_CAPTCHA_SECRET: null,
  SECURITY_REFRESH_TOKEN_REUSE_INTERVAL: 10,
  RATE_LIMIT_EMAIL_SENT: 0,
  MAILER_SECURE_EMAIL_CHANGE_ENABLED: true,
  SMS_MESSAGEBIRD_ACCESS_KEY: null,
  SMS_MESSAGEBIRD_ORIGINATOR: null,
  SMS_VONAGE_API_KEY: null,
  SMS_VONAGE_API_SECRET: null,
  SMS_VONAGE_FROM: null,
  SMS_TEXTLOCAL_API_KEY: null,
  SMS_TEXTLOCAL_SENDER: null,
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGetAll(req, res)
    case 'POST':
      return handlePost(req, res)
    case 'PATCH':
      return handlePatch(req, res)
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PATCH'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const handleGetAll = async (req: NextApiRequest, res: NextApiResponse) => {
  // Platform only API
  try {
    const accessToken = JSON.parse(req.cookies['_token']).token
    if (process.env.MEMFIRE_CLOUD_API_URL) {
      let response = await get(
        `${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/project/basic/config?projectId=${process.env.BASE_PROJECT_ID}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      // 异常尚未处理
      if (response.code === 0) {
        return res.status(200).json(response.data)
      } else  {
        return res.status(response.error.code).json(response)
      }
    } else {
      return res.status(200).json(defaultConfig)
    }
  } catch (e) {
    return res.status(401).json({ error: { message: e } })
  }
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const accessToken = JSON.parse(req.cookies['_token']).token
    if (process.env.MEMFIRE_CLOUD_API_URL) {
      let response = await post(
        `${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/project/basic/config`,
        { project_id: process.env.BASE_PROJECT_ID, ...req.body },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.code === 0) {
        return res.status(200).json(response.data)
      } else {
        return res.status(response.error.code).json(response)
      }
    } else {
      return res.status(200).json({})
    }
  } catch (e) {
    return res.status(401).json({ error: { message: e } })
  }
}

const handlePatch = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const accessToken = JSON.parse(req.cookies['_token']).token
    if (process.env.MEMFIRE_CLOUD_API_URL) {
      let response = await post(
        `${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/project/basic/config`,
        { project_id: process.env.BASE_PROJECT_ID, ...req.body },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.code === 0) {
        return res.status(200).json(response.data)
      } else {
        return res.status(response.status).json({ error: { message: response.msg } })
      }
    } else {
      return res.status(200).json({
        ...defaultConfig,
        ...req.body,
      })
    }
  } catch (e) {
    return res.status(401).json({ error: { message: e } })
  }
}
