import express, { Request, Response } from 'express'
import client from '../utils/client'
import { NumberRequestParams } from '../@types/request'
import { logger, parseContact, toClient, toUser } from '../utils/format'
import { ErrorResponse, GetProfileResponse } from '../@types/response'

const router = express.Router()

router.get('/:number', async (req: Request<NumberRequestParams>, res: Response<GetProfileResponse | ErrorResponse>) => {
  const { number } = req.params

  if (!number?.length) {
    res.status(400).json({
      status: false,
      error: 'Missing "number" parameter in URL.'
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
    logger('error', `Failed to get profile ${formattedPhone}.`, error)

    res.status(500).json({
      status: false,
      error: `Error getting profile ${formattedPhone}.`,
      details: error?.message
    })
  }
})

export default router
