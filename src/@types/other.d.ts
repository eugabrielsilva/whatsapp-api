import { Message } from "whatsapp-web.js"
import { FormattedMessage } from "./response"

export type RetryOptions = {
    maxRetries?: number
    delayMs?: number
}

export type Job = {
    id: string
    callback: (id: string) => Promise<void>
    delay: number
}

export type MessageHistory = {
    job_id: string
    created_at: string
    status: 'queued' | 'sent' | 'failed'
    message?: {
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
    error?: any
}