import { MessageTypes } from 'whatsapp-web.js'

export type FormattedMessage = {
  id: string
  type: string
  from: string
  to: string
  body: string
  date: string
  is_temporary: boolean
  is_forwarded: boolean
  is_mine: boolean
  is_broadcast: boolean
  media?: {
    url: string
    type: string
    extension: string
    filename?: string | null
  }
  location?: {
    latitude: number
    longitude: number
    name?: string | null
    address?: string | null
    url?: string | null
  }
}

export type FormattedContact = {
  number: string
  name: string
  contact_name?: string | null
  shortname?: string | null
  profile_picture: string | null
  status: string | null
  is_saved: boolean
  is_blocked: boolean
  is_business: boolean
  is_enterprise: boolean
  is_me: boolean
  is_valid: boolean
}

export type FormattedChat = {
  id: string
  name: string
  date: string
  unread_messages: number
  is_group: boolean
  is_muted: boolean
  is_readonly: boolean
  is_archived: boolean
  is_pinned: boolean
}

export type ErrorResponse = {
  status: boolean
  error: string
  details?: string
}

export type GetChatResponse = {
  status: boolean
  messages: FormattedMessage[]
}

export type GetChatsResponse = {
  status: boolean
  chats: FormattedChat[]
}

export type GetProfileResponse = {
  status: boolean
  profile: FormattedContact
}

export type CreatedResponse = {
  status: boolean
  message?: string
}

export type MediaInfo = {
  filename: string
  extension: string
}
