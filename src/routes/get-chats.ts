import express, { Request, Response } from 'express'
import client from '../utils/client'
import { logger, parseChatInfo } from '../utils/format'
import { Chat } from 'whatsapp-web.js'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  logger('info', 'Getting all chats...')

  try {
    const chats = await client.getChats()
    const parsedChats = chats.map((chat: Chat) => {
      return parseChatInfo(chat)
    })

    logger('info', 'Finished getting chats.')

    res.status(200).json({
      status: true,
      chats: parsedChats
    })
  } catch (error: any) {
    logger('error', 'Failed to get chats.', error)

    res.status(500).json({
      status: false,
      error: 'Error getting chats.',
      details: error?.message
    })
  }
})

export default router
