export type NumberRequestParams = {
  number: string
}

export type SendMediaRequestBody = {
  message?: string
  view_once?: boolean
  as_document?: boolean
  as_voice?: boolean
  as_gif?: boolean
  as_sticker?: boolean
}

export type SendLocationRequestBody = {
  latitude: number
  longitude: number
  address?: string
  url?: string
}

export type SendMessageRequestBody = {
  message: string
}

export type GetChatRequestQuery = {
  limit?: number
}
