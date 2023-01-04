import { withSentry } from '@sentry/nextjs'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import { IS_PLATFORM } from '../constants'
import { apiAuthenticate } from './apiAuthenticate'
import {get} from "../common/fetch";

// Purpose of this apiWrapper is to function like a global catchall for ANY errors
// It's a safety net as the API service should never drop, nor fail

export default async function apiWrapper(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: NextApiHandler,
  options?: { withAuth: boolean }
) {
  try {
    const { withAuth } = options || {}

    const secret = process.env.JWT_SECRET_KEY || ''
    const { token, refreshToken } = JSON.parse(req.cookies['_token'])
    verify(token, secret, async (err: any, decoded: any) => {
      if (err) {
        if (err.name === 'TokenExpireError') {
          const response = await get(
        `${process.env.MEMFIRE_CLOUD_API_URL}/api/v1/auth/refresh`,
            {
              headers: {
                refreshToken: refreshToken,
              },
            }
          )
          if (response.code === 0) {
            const newToken = JSON.stringify(response.data)
            req.cookies['_token'] = newToken
            res.setHeader('Set-cookie', newToken)
          } else {
            return res.status(401).json({})
          }
        } else {
          return res.status(401).json({})
        }
      }
    })

    /*
     * 不论哪里，都不需要判定用户是否拥有访问api的权利，因为studio是完全独立的
     */
    // if (IS_PLATFORM && withAuth) {
    //   const response = await apiAuthenticate(req, res)
    //   if (response.error) {
    //     return res.status(401).json({
    //       error: {
    //         message: `Unauthorized: ${response.error.message}`,
    //       },
    //     })
    //   } else {
    //     // Attach user information to request parameters
    //     ;(req as any).user = response
    //   }
    // }

    // const func = withSentry(handler as any)
    // @ts-ignore



    return await handler(req, res)
  } catch (error) {
    //@ts-ignore
    if(error.toString().includes('SyntaxError: Unexpected token u in JSON at position 0')) {
      return res.status(401).json({})
    } else {
      return res.status(500).json({ error })
    }
  }
}
