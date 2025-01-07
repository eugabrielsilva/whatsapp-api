import { MessageTypes } from 'whatsapp-web.js'

export type FormattedMessage = {
  id: string
  type: MessageTypes
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
    filename?: string | null
  }
  location?: {
    latitude: number
    longitude: number
    name?: string
    address?: string
    url?: string
  }
}

export type FormattedContact = {
  number: string
  name: string
  contact_name?: string
  shortname?: string
  profile_picture: string
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
