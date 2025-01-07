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
  media?: {
    url: string
    type: string
    filename?: string | null
  }
  location?: {
    latitude: number
    longitude: number
  }
}
