import express, { Request, Response } from 'express'
import client from '../utils/client'
import { WAState } from 'whatsapp-web.js'
import { CreatedResponse, ErrorResponse } from '../@types/response'

const router = express.Router()

router.get('/', async (req: Request, res: Response<CreatedResponse | ErrorResponse>) => {
  try {
    const state = await client.getState()

    res.status(200).json({
      status: state === WAState.CONNECTED
    })
  } catch (error: any) {
    res.status(500).json({
      status: false,
      error: 'Error checking login status.',
      details: error?.message
    })
  }
})

export default router
