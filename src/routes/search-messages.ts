import express, { Request, Response } from 'express'
import { Message } from 'whatsapp-web.js'
import client from '../utils/client'
import { toClient, logger, getMessageBody, toUser } from '../utils/format'
import { SearchMessagesRequestQuery } from '../@types/request'
import { ErrorResponse, GetChatResponse } from '../@types/response'

const router = express.Router()

router.get('/', async (req: Request<any, any, any, SearchMessagesRequestQuery>, res: Response<GetChatResponse | ErrorResponse>) => {
  const { query, limit, page, number } = req.query

  if (!query?.length) {
    res.status(400).json({
      status: false,
      error: 'Missing "query" parameter in URL.'
    })
    return
  }

  logger('info', `Searching messages for "${query}"...`)

  try {
    let chatId: string | undefined = undefined

    if (number?.length) {
      const formattedPhone = toUser(number)
      const numberChatId = await client.getNumberId(toClient(number))
      if (!numberChatId) {
        res.status(404).json({
          status: false,
          error: `Number ${formattedPhone} is invalid or not registered on WhatsApp.`
        })
        return
      }

      chatId = numberChatId._serialized
    }

    const messages = await client.searchMessages(query, {
      limit,
      page,
      chatId
    })

    const parsedMessages = await Promise.all(
      messages.map(async (message: Message) => {
        const messageBody = await getMessageBody(message)
        return messageBody
      })
    )

    const filteredMessages = parsedMessages.filter(msg => msg !== null)

    logger('info', 'Finished searching messages.')

    res.status(200).json({
      status: true,
      messages: filteredMessages
    })
  } catch (error: any) {
    logger('error', 'Failed to search messages.', error)

    res.status(500).json({
      status: false,
      error: 'Error searching messages.',
      details: error?.message
    })
  }
})

export default router
