

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
        .json(
            {
                "data": {
                    "data": [
                        {
                            "timestamp": 1670457600000,
                            "total_auth_requests": 0,
                            "total_realtime_requests": 0,
                            "total_rest_requests": 11,
                            "total_storage_requests": 0,
                            "period_start": "2022-12-08T00:00:00+00:00"
                        },
                        {
                            "timestamp": 1670544000000,
                            "total_auth_requests": 0,
                            "total_realtime_requests": 6,
                            "total_rest_requests": 14,
                            "total_storage_requests": 0,
                            "period_start": "2022-12-09T00:00:00+00:00"
                        },
                        {
                            "timestamp": 1670630400000,
                            "total_auth_requests": 0,
                            "total_realtime_requests": 0,
                            "total_rest_requests": 0,
                            "total_storage_requests": 0,
                            "period_start": "2022-12-10T00:00:00+00:00"
                        },
                        {
                            "timestamp": 1670716800000,
                            "total_auth_requests": 0,
                            "total_realtime_requests": 0,
                            "total_rest_requests": 0,
                            "total_storage_requests": 0,
                            "period_start": "2022-12-11T00:00:00+00:00"
                        },
                        {
                            "timestamp": 1670803200000,
                            "total_auth_requests": 0,
                            "total_realtime_requests": 0,
                            "total_rest_requests": 0,
                            "total_storage_requests": 0,
                            "period_start": "2022-12-12T00:00:00+00:00"
                        },
                        {
                            "timestamp": 1670889600000,
                            "total_auth_requests": 0,
                            "total_realtime_requests": 0,
                            "total_rest_requests": 8,
                            "total_storage_requests": 0,
                            "period_start": "2022-12-13T00:00:00+00:00"
                        },
                        {
                            "timestamp": 1670976000000,
                            "total_auth_requests": 0,
                            "total_realtime_requests": 0,
                            "total_rest_requests": 0,
                            "total_storage_requests": 0,
                            "period_start": "2022-12-14T00:00:00+00:00"
                        }
                    ],
                    "format": "",
                    "total": 39,
                    "totalGrouped": {
                        "total_auth_requests": 0,
                        "total_realtime_requests": 6,
                        "total_rest_requests": 33,
                        "total_storage_requests": 0
                    },
                    "totalAverage": 5.571428571428571
                },
                "project_ref": "cojxhlbhnpzbvqlxzrzp"
            }
        )
}
