import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req

    switch (method) {
        case 'POST':
            return handlePost(req, res)
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
    }
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
    return res
        .status(200)
        .json({
            id: 1,
            ref: 'default2',
            name: req.body.name || 'Default Project'
        })
}
