import { Chat, Contact, Message, MessageTypes } from 'whatsapp-web.js'
import fs from 'fs'
import path from 'path'
import { FormattedChat, FormattedContact, FormattedMessage } from '../@types/response'
import { randomUUID } from 'crypto'
import { getExtension } from 'mime'

export function toClient(phone: string): string {
  return phone.replace(/\D/g, '') + '@c.us'
}

export function toUser(phone: string): string {
  return '+' + phone.replace('@c.us', '')
}

export function toDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString()
}

export function temporaryFilename(mimeType: string) {
  const extension: string = getExtension(mimeType) || 'txt'
  return randomUUID() + '.' + extension
}

export async function getMessageBody(message: Message): Promise<FormattedMessage | null> {
  let messageBody = null

  if (message.type === MessageTypes.TEXT) {
    messageBody = parseTextMessage(message)
  } else if (message.type === MessageTypes.LOCATION) {
    messageBody = parseLocationMessage(message)
  } else if (message.hasMedia) {
    messageBody = await parseMediaMessage(message)
  }

  return messageBody
}

export function parseTextMessage(message: Message): FormattedMessage {
  return {
    id: message.id.id,
    type: message.type,
    from: toUser(message.from),
    to: toUser(message.to),
    body: message.body,
    date: toDate(message.timestamp),
    is_temporary: message.isEphemeral,
    is_forwarded: message.isForwarded,
    is_mine: message.fromMe,
    is_broadcast: message.broadcast
  }
}

export async function parseMediaMessage(message: Message): Promise<FormattedMessage> {
  const result: FormattedMessage = {
    ...parseTextMessage(message)
  }

  const HOST = process.env.HOST || 'http://localhost'
  const PORT = process.env.PORT || 3000

  try {
    const media = await message.downloadMedia()
    if (!media || !media.mimetype || !media.data) return result

    const data = Buffer.from(media.data, 'base64')
    const filename = temporaryFilename(media.mimetype)
    const mediaPath = path.join(process.cwd(), 'public/media', filename)
    fs.promises.writeFile(mediaPath, data)

    result.media = {
      url: `${HOST}:${PORT}/media/${filename}`,
      type: media.mimetype,
      filename: media.filename
    }

    return result
  } catch (error) {
    logger('error', `Failed to download media from message ${message.id}.`, error)
    return result
  }
}

export function parseLocationMessage(message: Message): FormattedMessage {
  return {
    ...parseTextMessage(message),
    location: {
      latitude: Number(message.location.latitude),
      longitude: Number(message.location.longitude),
      name: message.location.options?.name,
      address: message.location.options?.address,
      url: message.location.options?.url
    }
  }
}

export function parseContact(contact: Contact, profilePicture: string, status: string | null): FormattedContact {
  return {
    number: toUser(contact.number),
    name: contact.pushname,
    contact_name: contact.name,
    shortname: contact.shortName,
    profile_picture: profilePicture,
    status: status,
    is_saved: contact.isMyContact,
    is_blocked: contact.isBlocked,
    is_business: contact.isBusiness,
    is_enterprise: contact.isEnterprise,
    is_me: contact.isMe,
    is_valid: contact.isWAContact
  }
}

export function parseChatInfo(chat: Chat): FormattedChat {
  return {
    id: toUser(chat.id.user),
    name: chat.name,
    date: toDate(chat.timestamp),
    unread_messages: chat.unreadCount,
    is_group: chat.isGroup,
    is_muted: chat.isMuted,
    is_readonly: chat.isReadOnly,
    is_archived: chat.archived,
    is_pinned: chat.pinned
  }
}

export function logger(type: string, message: string, ...optionalParams: any[]): void {
  const colors = {
    reset: '\x1b[0m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m'
  }

  switch (type) {
    case 'warning':
      console.warn(`${colors.yellow}[WARNING] ${message}${colors.reset}`, ...optionalParams)
      break
    case 'auth':
      console.log(`${colors.magenta}[AUTH] ${message}${colors.reset}`, ...optionalParams)
      break
    case 'error':
      console.error(`${colors.red}[ERROR] ${message}${colors.reset}`, ...optionalParams)
      break
    case 'info':
      console.log(`${colors.blue}[INFO] ${message}${colors.reset}`, ...optionalParams)
      break
    default:
      break
  }
}
