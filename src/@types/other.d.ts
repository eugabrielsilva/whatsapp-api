import { Message } from "whatsapp-web.js"
import { FormattedMessage } from "./response"

export type RetryOptions = {
    maxRetries?: number
    delayMs?: number
}

export type Job = {
    id: string
    callback: () => Promise<void>
    delay: number
}

export type MessageHistoryData = {
    number: string
    body?: string
    location?: {
        latitude: number
        longitude: number
    },
    media?: {
        filename: string
        mimetype: string
        size: number
    }
}

export type MessageHistory = {
    job_id: string
    created_at: string
    status: 'queued' | 'sent' | 'failed'
    message?: MessageHistoryData
    error?: any
}