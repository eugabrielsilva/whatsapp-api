import express, { Request, Response } from 'express'
import client from '../utils/client'
import { toClient, toUser, logger } from '../utils/format'

const router = express.Router()

router.post('/:number', (req: Request<{ number: string }, any, { message?: string }>, res: Response) => {
  const { number } = req.params
  const { message } = req.body

  if (!number?.length) {
    res.status(400).json({
      status: false,
      error: 'Missing "number" parameter in URL.'
    })
    return
  }

  if (!message?.length) {
    res.status(400).json({
      status: false,
      error: 'Missing "message" parameter in request body.'
    })
    return
  }

  const chatId = toClient(number)
  const formattedPhone = toUser(number)

  logger('info', `Sending message "${message}" to ${formattedPhone}...`)

  client
    .sendMessage(chatId, message)
    .then(() => {
      logger('info', `Message sent to ${formattedPhone}.`)

      res.status(200).json({
        status: true,
        message: 'Message sent successfully.'
      })
    })
    .catch((error: Error) => {
      logger('error', `Failed to send message to ${formattedPhone}.`, error)

      res.status(500).json({
        status: false,
        error: 'Error sending message.',
        details: error.message
      })
    })
})

export default router
