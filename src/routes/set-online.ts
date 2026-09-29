import express, { Request, Response } from 'express'
import client from '../utils/client'
import { CreatedResponse, ErrorResponse } from '../@types/response'
import retry from '../utils/retry'

const router = express.Router()

router.post('/', async (req: Request, res: Response<CreatedResponse | ErrorResponse>) => {
  try {
    await retry(async () => {
      await client.sendPresenceAvailable()
    })

    res.status(200).json({
      status: true
    })
  } catch (error: any) {
    res.status(500).json({
      status: false,
      error: 'Error sending presence status.',
      details: error?.message
    })
  }
})

export default router
