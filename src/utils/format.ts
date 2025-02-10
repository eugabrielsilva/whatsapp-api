import { Chat, Contact, Message, MessageMedia, MessageTypes } from 'whatsapp-web.js'
import fs from 'fs'
import path from 'path'
import { FormattedChat, FormattedContact, FormattedMessage, MediaInfo } from '../@types/response'
import { randomUUID } from 'crypto'
import { getExtension } from 'mime'

export function toClient(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function toUser(phone: string): string {
  return '+' + phone.replace('@c.us', '')
}

export function toDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString()
}

export function getMediaFilename(message: Message, media: MessageMedia): MediaInfo {
  const extension = getExtension(media.mimetype) || 'txt'
  const filename = media.filename || message.id.id || randomUUID()
  return {
    filename: filename + '.' + extension,
    extension
  }
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
    type: message.type == MessageTypes.TEXT ? 'text' : message.type,
    from: toUser(message.from),
    to: toUser(message.to),
    body: message.body,
    date: toDate(message.timestamp),
    timestamp: message.timestamp,
    is_temporary: Boolean(message.isEphemeral),
    is_forwarded: Boolean(message.isForwarded),
    is_mine: Boolean(message.fromMe),
    is_broadcast: Boolean(message.broadcast)
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

    const { filename, extension } = getMediaFilename(message, media)
    const mediaPath = path.join(process.cwd(), 'public/media', filename)

    try {
      await fs.promises.access(mediaPath)
    } catch {
      const data = Buffer.from(media.data, 'base64')
      await fs.promises.writeFile(mediaPath, data)
    }

    result.media = {
      url: `${HOST}:${PORT}/media/${filename}`,
      type: media.mimetype,
      extension: extension,
      filename: media.filename || null
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
      name: message.location.options?.name || null,
      address: message.location.options?.address || null,
      url: message.location.options?.url || null
    }
  }
}

export function parseContact(contact: Contact, profilePicture: string, status: string | null): FormattedContact {
  return {
    number: toUser(contact.number),
    name: contact.pushname,
    contact_name: contact.name || null,
    shortname: contact.shortName || null,
    profile_picture: profilePicture || null,
    status: status || null,
    is_saved: Boolean(contact.isMyContact),
    is_blocked: Boolean(contact.isBlocked),
    is_business: Boolean(contact.isBusiness),
    is_enterprise: Boolean(contact.isEnterprise),
    is_me: Boolean(contact.isMe),
    is_valid: Boolean(contact.isWAContact)
  }
}

export function parseChatInfo(chat: Chat): FormattedChat {
  return {
    id: toUser(chat.id._serialized),
    name: chat.name,
    date: toDate(chat.timestamp),
    timestamp: chat.timestamp,
    unread_messages: chat.unreadCount,
    is_group: Boolean(chat.isGroup),
    is_muted: Boolean(chat.isMuted),
    is_readonly: Boolean(chat.isReadOnly),
    is_archived: Boolean(chat.archived),
    is_pinned: Boolean(chat.pinned)
  }
}

export function logger(type: string, message: string, ...optionalParams: any[]): void {
  const colors: Record<string, string> = {
    reset: '\x1b[0m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    info: '\x1b[34m',
    auth: '\x1b[35m'
  }

  const levels: Record<string, (...args: any[]) => void> = {
    warning: console.warn,
    error: console.error,
    info: console.log,
    auth: console.log
  }

  const date = new Date().toLocaleString()
  const color = colors[type] || colors.reset
  const log = levels[type] || console.log

  log(`${color}[${date}] [${type.toUpperCase()}] ${message}${colors.reset}`, ...optionalParams)
}
