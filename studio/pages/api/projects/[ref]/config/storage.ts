import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'
import { get, post } from '../../../../../lib/common/fetch'
import { parseCookies } from 'nookies'

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
  // Platform specific endpoint
  if (process.env.MEMFIRE_CLOUD_API_URL) {
    const cookies = parseCookies()
    let response = await get(
      `${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/project/storage/config?projectId=${process.env.BASE_PROJECT_ID}`,
      {
        Authorization: cookies._token,
      }
    )
    // 异常尚未处理
    if (response.body.code === 0) {
      return res.status(200).json(response.body.data)
    }
  } else {
    return res.status(200).json({
      fileSizeLimit: 52428800,
      isFreeTier: false,
    })
  }
}

const handlePatch = async (req: NextApiRequest, res: NextApiResponse) => {
    if (process.env.MEMFIRE_CLOUD_API_URL) {
    const cookies = parseCookies()
    let response = await post(
      `${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/project/storage/config?projectId=${process.env.BASE_PROJECT_ID}`,
        req.body,
      {
        Authorization: cookies._token,
      }
    )
    // 异常尚未处理
    if (response.body.code === 0) {
      return res.status(200).json(response.body.data)
    }
  } else {
    return res.status(200).json(req.body)
  }
}
