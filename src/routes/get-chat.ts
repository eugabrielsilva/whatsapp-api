import express, { Request, Response } from 'express'
import { Message } from 'whatsapp-web.js'
import client from '../utils/client'
import { toClient, toUser, logger, getMessageBody } from '../utils/format'
import { GetChatRequestQuery, NumberRequestParams } from '../@types/request'
import { ErrorResponse, GetChatResponse } from '../@types/response'

const router = express.Router()

function errorHandler(chatId: string, error: any, res: Response<ErrorResponse>) {
  const phone = toUser(chatId)
  logger('error', `Failed to get chat from ${phone}.`, error)

  res.status(500).json({
    status: false,
    error: 'Error getting chat.',
    details: error?.message
  })
}

router.get('/:number', async (req: Request<NumberRequestParams, any, any, GetChatRequestQuery>, res: Response<GetChatResponse | ErrorResponse>) => {
  const { number } = req.params
  const limit = req.query?.limit || Infinity

  if (!number?.length) {
    res.status(400).json({
      status: false,
      error: 'Missing "number" parameter.'
    })
    return
  }

  const chatId = toClient(number)
  const formattedPhone = toUser(number)

  logger('info', `Getting chat from ${formattedPhone}...`)

  try {
    const chat = await client.getChatById(chatId)
    const messages = await chat.fetchMessages({ limit })

    const parsedMessages = await Promise.all(
      messages.map(async (message: Message) => {
        const messageBody = await getMessageBody(message)
        return messageBody
      })
    )

    logger('info', `Finished getting chat from ${formattedPhone}.`)

    res.status(200).json({
      status: true,
      messages: parsedMessages
    })
  } catch (error: any) {
    errorHandler(chatId, error, res)
  }
})

export default router
