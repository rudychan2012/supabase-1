import { NextApiRequest, NextApiResponse } from 'next'

import apiWrapper from 'lib/api/apiWrapper'
import { PROJECT_REST_URL } from 'pages/api/constants'
import { get } from '../../../../lib/common/fetch'

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGet(req, res)
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const accessToken = JSON.parse(req.cookies['_token']).token
    if (process.env.MEMFIRE_CLOUD_API_URL) {
      let response = await get(
        `${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${process.env.BASE_PROJECT_ID}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      // 异常尚未处理
      if (response.code === 0) {
        return res.status(200).json({
          name: process.env.DEFAULT_PROJECT_NAME || 'Default Project',
          ...response.data,
          connectionString: createDbConnectionString({
            db_user_supabase: 'postgres',
            db_host: 'localhost',
            db_pass_supabase: process.env.POSTGRES_PASSWORD as string,
            db_port: 5432,
            db_name: 'postgres',
            db_ssl: false,
          }),
        })
      } else {
        return res.status(response.status).json({ error: { message: response.msg } })
      }
    } else {
      const resData = {
        id: 1,
        ref: 'default',
        name: process.env.DEFAULT_PROJECT_NAME || 'Default Project',
        organization_id: 1,
        cloud_provider: 'localhost',
        status: 'ACTIVE_HEALTHY',
        region: 'local',
        connectionString: createDbConnectionString({
          db_user_supabase: 'postgres',
          db_host: 'localhost',
          db_pass_supabase: process.env.POSTGRES_PASSWORD as string,
          db_port: 5432,
          db_name: 'postgres',
          db_ssl: false,
        }),
        restUrl: PROJECT_REST_URL,
      }

      return res.status(200).json(resData)
    }
  } catch (e) {
    return res.status(401).json({ error: { message: e } })
  }
}

/**
 * Creates a Postgres connection string using the Supabase master login.
 * Expects the passwords to be encrypted (straight from the DB)
 */
const createDbConnectionString = ({
  db_user_supabase,
  db_pass_supabase,
  db_host,
  db_port,
  db_name,
  db_ssl,
}: {
  db_user_supabase: string
  db_host: string
  db_pass_supabase: string
  db_port: number
  db_name: string
  db_ssl: boolean
}) => {
  return `postgres://${db_user_supabase}:${db_pass_supabase}@${db_host}:${db_port}/${db_name}?sslmode=${
    db_ssl ? 'require' : 'disable'
  }`
}
