import express, { Request, Response } from 'express'
import client from '../utils/client'
import { logger, parseContact } from '../utils/format'
import { Contact } from 'whatsapp-web.js'
import { ErrorResponse, GetContactsResponse } from '../@types/response'

const router = express.Router()

router.get('/', async (req: Request, res: Response<GetContactsResponse | ErrorResponse>) => {
  logger('info', 'Getting all contacts...')

  try {
    const contacts = await client.getContacts()

    const parsedContacts = await Promise.all(
      contacts.map(async (contact: Contact) => {
        const profilePicture = await contact.getProfilePicUrl()
        const status = await contact.getAbout()
        return parseContact(contact, profilePicture, status)
      })
    )

    logger('info', 'Finished getting contacts.')

    res.status(200).json({
      status: true,
      contacts: parsedContacts
    })
  } catch (error: any) {
    logger('error', 'Failed to get contacts.', error)

    res.status(500).json({
      status: false,
      error: 'Error getting contacts.',
      details: error?.message
    })
  }
})

export default router
