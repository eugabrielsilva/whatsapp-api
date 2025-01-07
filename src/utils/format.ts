import { Contact, Message, MessageTypes } from 'whatsapp-web.js'
import fs from 'fs'
import path from 'path'
import { FormattedMessage } from '../@types/response'
import { randomUUID } from 'crypto'
import { getExtension } from 'mime'

export function toClient(phone: string): string {
  return phone.replace(/\D/g, '') + '@c.us'
}

export function toUser(phone: string): string {
  return '+' + phone.replace('@c.us', '')
}

export function toDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

export function temporaryFilename(mimeType: string) {
  const extension: string = getExtension(mimeType) || 'txt'
  return randomUUID() + '.' + extension
}

export async function getMessageBody(message: Message) {
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
    is_forwarded: message.isForwarded
  }
}

export async function parseMediaMessage(message: Message) {
  const result: FormattedMessage = {
    ...parseTextMessage(message)
  }

  const PORT = process.env.PORT || 3000

  try {
    const media = await message.downloadMedia()
    if (!media) return result

    const filename = temporaryFilename(media.mimetype)
    const mediaPath = path.join(process.cwd(), 'public/downloads', filename)
    fs.writeFileSync(mediaPath, media.data)

    result.media = {
      url: `http://localhost:${PORT}/downloads/${filename}`,
      type: media.mimetype,
      filename: media.filename
    }

    return result
  } catch (error) {
    logger('error', `Failed to download media from message ${message.id}.`, error)
    return result
  }
}

export function parseLocationMessage(message: Message) {
  return {
    ...parseTextMessage(message),
    location: {
      latitude: message.location.latitude,
      longitude: message.location.longitude
    }
  }
}

export function parseContact(contact: Contact, profilePicture: string, status: string | null) {
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

export function logger(type: string, message: string, ...optionalParams: any[]) {
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
