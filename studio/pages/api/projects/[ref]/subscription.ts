import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req

    switch (method) {
        case 'GET':
            return handlePost(req, res)
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
    }
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
    // Platform specific endpoint
    // const response = {
    //     tier: {
    //         supabase_prod_id: 'tier_pro'
    //     }
    // }
    const response = {
        data: {
            tier: {
                name: 'Self Hosted',
                prod_id: '1',
                unit_amount: 10,
                price_id: '1',
                supabase_prod_id: 'tier_pro',
                key: '222'
            },
            addons: [],
            billing: {
                billing_cycle_anchor: undefined,
                current_period_end: undefined,
                current_period_start: undefined,
            },
        },
    }
    return res.status(200).json(response)
}

