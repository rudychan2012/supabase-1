import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'
import {get, post} from "../../../../../lib/common/fetch";

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
    // Platform specific endpoint
    if (process.env.MEMFIRE_CLOUD_API_URL) {
      let response = await get(
        `${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/project/postgrest/config?projectId=${process.env.BASE_PROJECT_ID}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        console.log(response)
      // 异常尚未处理
      if (response.code === 0) {
        return res.status(200).json(response.data)
      } else {
        return res.status(response.status).json({ error: { message: response.msg } })
      }
    } else {
      const resData = {
        db_schema: "public, storage, graphql_public",
        db_anon_role: "anon",
        role_claim_key: ".role",
        max_rows: 1000,
        db_extra_search_path: "public, extensions",
        jwt_secret: process.env.JWT_SECRET
    }
    return res.status(200).json(resData)
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
        `${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/project/postgrest/config`,
          {projectId: process.env.BASE_PROJECT_ID, ...req.body},
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
      return res.status(200).json(req.body)
    }
  } catch (e) {
    return res.status(401).json({ error: { message: e } })
  }
}

