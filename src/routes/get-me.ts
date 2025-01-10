import express, { Request, Response } from 'express'
import client from '../utils/client'
import { logger, parseContact, toClient, toUser } from '../utils/format'
import { ErrorResponse, GetProfileResponse } from '../@types/response'

const router = express.Router()

router.get('/', async (req: Request, res: Response<GetProfileResponse | ErrorResponse>) => {
  const chatId = toClient(client.info.wid.user)

  logger('info', `Getting current user profile...`)

  try {
    const contact = await client.getContactById(chatId)
    const profilePicture = await contact.getProfilePicUrl()
    const status = await contact.getAbout()

    const parsedContact = parseContact(contact, profilePicture, status)

    logger('info', `Finished getting current user profile.`)

    res.status(200).json({
      status: true,
      profile: parsedContact
    })
  } catch (error: any) {
    logger('error', `Failed to get current user profile.`, error)

    res.status(500).json({
      status: false,
      error: 'Error getting current user profile.',
      details: error?.message
    })
  }
})

export default router
