import express, { Request, Response } from 'express'
import client from '../utils/client'
import { SendLocationRequestBody, NumberRequestParams } from '../@types/request'
import { Location } from 'whatsapp-web.js'
import { logger, toClient, toUser } from '../utils/format'
import { CreatedResponse, ErrorResponse } from '../@types/response'
import Queue from '../utils/queue'
import retry from '../utils/retry'

const router = express.Router()

router.post('/:number', async (req: Request<NumberRequestParams, any, SendLocationRequestBody>, res: Response<CreatedResponse | ErrorResponse>) => {
  const { number } = req.params
  const { latitude, longitude, address, url, reply_to } = req.body

  if (!number?.length) {
    res.status(400).json({
      status: false,
      error: 'Missing "number" parameter in URL.'
    })
    return
  }

  if (!latitude) {
    res.status(400).json({
      status: false,
      error: 'Missing "latitude" parameter in request body.'
    })
    return
  }

  if (!longitude) {
    res.status(400).json({
      status: false,
      error: 'Missing "longitude" parameter in request body.'
    })
    return
  }

  const location = new Location(latitude, longitude, {
    address: address || undefined,
    url: url || undefined
  })

  const formattedPhone = toUser(number)

  try {
    const chatId = await retry(async () => {
      return await client.getNumberId(toClient(number))
    })

    if (!chatId) {
      res.status(404).json({
        status: false,
        error: `Number ${formattedPhone} is invalid or not registered on WhatsApp.`
      })
      return
    }

    logger('info', `Queuing location "${latitude},${longitude}" to ${formattedPhone}...`)

    Queue.add(async () => {
      await retry(async () => {
        await client.sendMessage(chatId._serialized, location, {
          quotedMessageId: reply_to || undefined
        })

        logger('info', `Location sent to ${formattedPhone}.`)
      })
    })

    res.status(201).json({
      status: true,
      message: `Location sent successfully to ${formattedPhone}.`
    })
  } catch (error: any) {
    logger('error', `Failed to send location to ${formattedPhone}.`, error)

    res.status(500).json({
      status: false,
      error: `Error sending location to ${formattedPhone}.`,
      details: error?.message
    })
  }
})

export default router
