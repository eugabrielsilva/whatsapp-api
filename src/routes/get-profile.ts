import express, { Request, Response } from 'express'
import client from '../utils/client'
import { NumberRequestParams } from '../@types/request'
import { logger, parseContact, toClient, toUser } from '../utils/format'

const router = express.Router()

function errorHandler(chatId: string, error: any, res: Response) {
  const phone = toUser(chatId)
  logger('error', `Failed to get profile ${phone}.`, error)

  res.status(500).json({
    status: false,
    error: 'Error getting profile.',
    details: error?.message
  })
}

router.get('/:number', async (req: Request<NumberRequestParams>, res: Response) => {
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

  logger('info', `Getting profile ${formattedPhone}...`)

  try {
    const contact = await client.getContactById(chatId)
    const profilePicture = await contact.getProfilePicUrl()
    const status = await contact.getAbout()

    const parsedContact = parseContact(contact, profilePicture, status)

    logger('info', `Finished getting profile ${formattedPhone}.`)

    res.status(200).json({
      status: true,
      profile: parsedContact
    })
  } catch (error: any) {
    errorHandler(chatId, error, res)
  }
})

export default router
