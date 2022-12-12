import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'

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
    return res.status(200).json({
        fileSizeLimit: 52428800,
        isFreeTier: false
    })
}

const handlePatch = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(200).json(req.body)
}

