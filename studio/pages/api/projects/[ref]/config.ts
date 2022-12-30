import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'
import { get, post } from '../../../../lib/common/fetch'

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGetAll(req, res)
    case 'PATCH':
      return handlePatch(req, res)
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const handleGetAll = async (req: NextApiRequest, res: NextApiResponse) => {
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
      } else {
        return res.status(response.error.code).json(response)
      }
    } else {
      return res.status(200).json({
        db_anon_role: 'anon',
        db_extra_search_path: 'public',
        db_schema: 'public, storage',
        jwt_secret: '-',
        max_rows: 100,
        role_claim_key: '.role',
      })
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
      return res.status(200).json({})
    }
  } catch (e) {
    return res.status(401).json({ error: { message: e } })
  }
}
