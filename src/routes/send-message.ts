import express, { Request, Response } from 'express'
import client from '../utils/client'
import { toClient, toUser, logger } from '../utils/format'
import { NumberRequestParams, SendMessageRequestBody } from '../@types/request'
import { CreatedResponse, ErrorResponse } from '../@types/response'

const router = express.Router()

router.post('/:number', async (req: Request<NumberRequestParams, any, SendMessageRequestBody>, res: Response<CreatedResponse | ErrorResponse>) => {
  const { number } = req.params
  const { message, reply_to } = req.body

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

  const formattedPhone = toUser(number)
  const chatId = await client.getNumberId(toClient(number))

  if (!chatId) {
    res.status(404).json({
      status: false,
      error: `Number ${formattedPhone} is invalid or not registered on WhatsApp.`
    })
    return
  }

  logger('info', `Sending message "${message}" to ${formattedPhone}...`)

  try {
    await client.sendMessage(chatId._serialized, message, {
      quotedMessageId: reply_to || undefined
    })

    logger('info', `Message sent to ${formattedPhone}.`)

    res.status(201).json({
      status: true,
      message: `Message sent successfully to ${formattedPhone}.`
    })
  } catch (error: any) {
    logger('error', `Failed to send message to ${formattedPhone}.`, error)

    res.status(500).json({
      status: false,
      error: `Error sending message to ${formattedPhone}.`,
      details: error?.message
    })
  }
})

export default router
