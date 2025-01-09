import express, { Request, Response } from 'express'
import client from '../utils/client'
import { WAState } from 'whatsapp-web.js'
import { CreatedResponse, ErrorResponse } from '../@types/response'
import { logger } from '../utils/format'

const router = express.Router()

router.post('/', async (req: Request, res: Response<CreatedResponse | ErrorResponse>) => {
  try {
    const state = await client.getState()

    if (state !== WAState.CONNECTED) {
      res.status(409).json({
        status: false,
        error: 'Client is not logged in.'
      })
      return
    }

    await client.logout()

    logger('auth', 'Client was logged out by the user.')

    res.status(200).json({
      status: true,
      message: 'Logged out successfully.'
    })
  } catch (error: any) {
    logger('error', 'Failed to logout.', error)

    res.status(500).json({
      status: false,
      error: 'Error in logout.',
      details: error?.message
    })
  }
})

export default router
