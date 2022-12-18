import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGetAll(req, res)
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const handleGetAll = async (req: NextApiRequest, res: NextApiResponse) => {
  return res
    .status(200)
    .json({
        // "db_size": {
        //     "usage": 29407304,
        //     "limit": 536870912,
        //     "cost": 0,
        //     "available_in_plan": true,
        //     "current": 29493321
        // },
        // "db_egress": {
        //     "usage": 0,
        //     "limit": 2147483648,
        //     "cost": 0,
        //     "available_in_plan": true
        // },
        // "storage_size": {
        //     "usage": 799582.7,
        //     "limit": 1073741824,
        //     "cost": 0,
        //     "available_in_plan": true,
        //     "current": 841666
        // },
        // "storage_egress": {
        //     "usage": 306,
        //     "limit": 2147483648,
        //     "cost": 0,
        //     "available_in_plan": true
        // },
        // "storage_image_render_count": {
        //     "usage": 0,
        //     "limit": -1,
        //     "cost": 0,
        //     "available_in_plan": false
        // },
        // "monthly_active_users": {
        //     "usage": 0,
        //     "limit": 50000,
        //     "cost": 0,
        //     "available_in_plan": true
        // },
        // "func_invocations": {
        //     "usage": 0,
        //     "limit": 500000,
        //     "cost": 0,
        //     "available_in_plan": true
        // },
        // "func_count": {
        //     "usage": 0,
        //     "limit": 10,
        //     "cost": 0,
        //     "available_in_plan": true
        // }
    })
}
