import express, { Request, Response } from 'express'
import client from '../utils/client'
import { SendLocationRequestBody, NumberRequestParams } from '../@types/request'
import { Location } from 'whatsapp-web.js'
import { logger, toClient, toUser } from '../utils/format'

const router = express.Router()

router.post('/:number', async (req: Request<NumberRequestParams, any, SendLocationRequestBody>, res: Response) => {
  const { number } = req.params
  const { latitude, longitude, address, url } = req.body

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
    address,
    url
  })

  const chatId = toClient(number)
  const formattedPhone = toUser(number)

  logger('info', `Sending location "${latitude},${longitude}" to ${formattedPhone}...`)

  try {
    await client.sendMessage(chatId, location)

    logger('info', `Location sent to ${formattedPhone}.`)

    res.status(200).json({
      status: true,
      message: 'Location sent successfully.'
    })
  } catch (error: any) {
    logger('error', `Failed to send location to ${formattedPhone}.`, error)

    res.status(500).json({
      status: false,
      error: 'Error sending location.',
      details: error?.message
    })
  }
})

export default router
