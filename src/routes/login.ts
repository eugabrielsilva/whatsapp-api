import express, { Request, Response } from 'express'
import client from '../utils/client'
import AuthHelper from '../utils/auth'
import { WAState } from 'whatsapp-web.js'
import { ErrorResponse } from '../@types/response'
import QRCode from 'qrcode'
import { logger } from '../utils/format'

const router = express.Router()

router.get('/', async (req: Request, res: Response<ErrorResponse | Buffer<ArrayBufferLike>>) => {
  try {
    const state = await client.getState()

    if (state === WAState.CONNECTED) {
      res.status(409).json({
        status: false,
        error: 'Client is already logged in.'
      })
      return
    }

    const qrCode = AuthHelper.getQr()

    if (qrCode === null) {
      res.status(503).json({
        status: false,
        error: 'Login is not ready yet. Please retry in a few seconds.'
      })
      return
    }

    const qrImage = await QRCode.toBuffer(qrCode)
    res.setHeader('Content-Type', 'image/png').send(qrImage)
  } catch (error: any) {
    logger('error', 'Failed to get login information.', error)

    res.status(500).json({
      status: false,
      error: 'Error getting login information.',
      details: error?.message
    })
  }
})

export default router
