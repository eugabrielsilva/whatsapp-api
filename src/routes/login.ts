import express, { Request, Response } from 'express'
import client from '../utils/client'
import AuthHelper from '../utils/auth'
import { WAState } from 'whatsapp-web.js'
import { ErrorResponse, QRCodeResponse } from '../@types/response'
import QRCode from 'qrcode'
import { logger } from '../utils/format'
import { LoginRequestQuery } from '../@types/request'

const router = express.Router()

router.get('/', async (req: Request<any, any, any, LoginRequestQuery>, res: Response<ErrorResponse | QRCodeResponse | Buffer<ArrayBufferLike>>) => {
  const { render } = req.query

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

    if (render) {
      const qrImage = await QRCode.toBuffer(qrCode)
      res.setHeader('Content-Type', 'image/png').send(qrImage)
      return
    }

    const base64 = await QRCode.toDataURL(qrCode)
    res.status(200).json({
      status: true,
      data: {
        raw: qrCode,
        base64
      }
    })
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
