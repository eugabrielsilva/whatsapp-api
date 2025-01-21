export type NumberRequestParams = {
  number: string
}

export type SearchMessagesRequestQuery = {
  query: string
  limit?: number
  page?: number
  number?: string
}

export type SendMediaRequestBody = {
  message?: string
  view_once?: boolean
  as_document?: boolean
  as_voice?: boolean
  as_gif?: boolean
  as_sticker?: boolean
  reply_to?: string
}

export type SendLocationRequestBody = {
  latitude: number
  longitude: number
  address?: string
  url?: string
  reply_to?: string
}

export type SendMessageRequestBody = {
  message: string
  reply_to?: string
}

export type GetChatRequestQuery = {
  limit?: number
}
