import express, { Request, Response } from 'express'
import { Chat, Message, MessageTypes } from 'whatsapp-web.js'
import client from '../utils/client'
import { toClient, toUser, prettyLogger, parseTextMessage } from '../utils/format'

const router = express.Router()

function errorHandler(chatId: string, error: Error, res: Response) {
  const phone = toUser(chatId)
  prettyLogger('error', `Failed to get chat from ${phone}.`, error)

  res.status(500).json({
    status: false,
    error: 'Error getting chat.',
    details: error.message
  })
}

router.get('/:number', (req: Request<{ number: string }>, res: Response) => {
  const { number } = req.params

  if (!number?.length) {
    res.status(400).json({
      status: false,
      error: 'Missing "number" parameter.'
    })
    return
  }

  const chatId = toClient(number)
  const formattedPhone = toUser(number)

  prettyLogger('info', `Getting chat from ${formattedPhone}...`)

  client
    .getChatById(chatId)
    .then((chat: Chat) => {
      chat
        .fetchMessages({
          limit: Infinity
        })
        .then((messages: Message[]) => {
          const parsedMessages = messages.map((msg: Message) => {
            if (msg.type === MessageTypes.TEXT) {
              return parseTextMessage(msg)
            }

            return null
          })

          prettyLogger('info', `Finished getting chat from ${formattedPhone}.`)

          res.status(200).json({
            status: true,
            messages: parsedMessages
          })
        })
        .catch((error: Error) => {
          errorHandler(chatId, error, res)
        })
    })
    .catch((error: Error) => {
      errorHandler(chatId, error, res)
    })
})

export default router
