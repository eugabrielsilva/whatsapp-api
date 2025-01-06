import express, { Request, Response } from 'express'
import client from '../utils/client'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { logger, toClient, toUser } from '../utils/format'
import { MessageMedia } from 'whatsapp-web.js'
import { SendMediaRequestBody, NumberRequestParams } from '../@types/request'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

router.post('/:number', upload.single('file'), (req: Request<NumberRequestParams, any, SendMediaRequestBody>, res: Response) => {
  const { number } = req.params
  const { message, asDocument, asViewOnce } = req.body
  const file = req.file

  if (!file) {
    res.status(400).json({
      status: false,
      error: 'No file was uploaded.'
    })
    return
  }

  if (!number?.length) {
    res.status(400).json({
      status: false,
      error: 'Missing "number" parameter in URL.'
    })
    return
  }

  const chatId = toClient(number)
  const formattedPhone = toUser(number)

  logger('info', `Sending media to ${formattedPhone}...`)

  const tempFilePath = file.path
  const media = MessageMedia.fromFilePath(tempFilePath)

  client
    .sendMessage(chatId, message || '', {
      media,
      caption: message,
      isViewOnce: asViewOnce || false,
      sendMediaAsDocument: asDocument || false
    })
    .then(() => {
      logger('info', `Media sent to ${formattedPhone}.`)
      fs.unlink(tempFilePath, () => {})

      res.status(200).json({
        status: true,
        message: 'Media sent successfully.'
      })
    })
    .catch((error: Error) => {
      logger('error', `Failed to send media to ${formattedPhone}.`, error)

      res.status(500).json({
        status: false,
        error: 'Error sending media.',
        details: error.message
      })
    })
})

export default router
