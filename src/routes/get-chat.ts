import express, { Request, Response } from 'express'
import { Message } from 'whatsapp-web.js'
import client from '../utils/client'
import { toClient, toUser, logger, getMessageBody } from '../utils/format'
import { GetChatRequestQuery, NumberRequestParams } from '../@types/request'
import { ErrorResponse, GetChatResponse } from '../@types/response'

const router = express.Router()

router.get('/:number', async (req: Request<NumberRequestParams, any, any, GetChatRequestQuery>, res: Response<GetChatResponse | ErrorResponse>) => {
  const { number } = req.params
  const limit = req.query?.limit ? Number(req.query.limit) : Infinity

  if (!number?.length) {
    res.status(400).json({
      status: false,
      error: 'Missing "number" parameter in URL.'
    })
    return
  }

  const formattedPhone = toUser(number)
  const chatId = await client.getNumberId(toClient(number))

  if (!chatId) {
    res.status(404).json({
      status: false,
      error: `Number ${formattedPhone} is invalid or not registered on WhatsApp.`
    })
    return
  }

  logger('info', `Getting chat from ${formattedPhone}...`)

  try {
    const chat = await client.getChatById(chatId._serialized)
    const messages = await chat.fetchMessages({ limit })

    const parsedMessages = await Promise.all(
      messages.map(async (message: Message) => {
        const messageBody = await getMessageBody(message)
        return messageBody
      })
    )

    const filteredMessages = parsedMessages.filter(msg => msg !== null).reverse()

    logger('info', `Finished getting chat from ${formattedPhone}.`)

    res.status(200).json({
      status: true,
      messages: filteredMessages
    })
  } catch (error: any) {
    logger('error', `Failed to get chat from ${formattedPhone}.`, error)

    res.status(500).json({
      status: false,
      error: `Error getting chat from ${formattedPhone}.`,
      details: error?.message
    })
  }
})

export default router
