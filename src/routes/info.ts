import express, { Request, Response } from 'express'
import client from '../utils/client'
import { ErrorResponse, InfoResponse } from '../@types/response'
import { logger } from '../utils/format'

const router = express.Router()

router.get('/', async (req: Request, res: Response<InfoResponse | ErrorResponse>) => {
  try {
    const version = await client.getWWebVersion()
    const state = await client.getState()

    res.status(200).json({
      status: true,
      data: {
        client: client.info,
        version,
        state
      }
    })
  } catch (error: any) {
    logger('error', 'Failed to get client information.', error)

    res.status(500).json({
      status: false,
      error: 'Error getting client information.',
      details: error?.message
    })
  }
})

export default router
