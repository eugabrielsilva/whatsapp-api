export type NumberRequestParams = {
  number: string
}

export type SendMediaRequestBody = {
  message?: string
  asDocument?: boolean
  asViewOnce?: boolean
}

export type SendMessageRequestBody = {
  message: string
}
