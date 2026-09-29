import { Job, MessageHistory, MessageHistoryData } from "../@types/other"
import { logger } from "./format"

export default class Queue {
    static jobs: Job[] = []
    static history: MessageHistory[] = []
    static running = false

    static add(callback: () => Promise<void>, message?: MessageHistoryData) {
        const id = crypto.randomUUID()

        this.jobs.push({
            id,
            callback,
            delay: this.randomDelay()
        })

        this.history.push({
            job_id: id,
            created_at: new Date().toISOString(),
            status: 'queued',
            message,
        })

        this.run()
    }

    static async run(): Promise<void> {
        if (this.running || this.jobs.length === 0) {
            return
        }

        this.running = true

        while (this.jobs.length > 0) {
            const job = this.jobs.shift()!

            try {
                await this.sleep(job.delay)
                await job.callback()

                this.updateHistory(job.id, {
                    status: 'sent'
                })
            } catch (error: any) {
                logger('error', 'Failed to process queue job:', error)

                this.updateHistory(job.id, {
                    status: 'failed',
                    error
                })
            }
        }

        this.running = false
    }

    static async updateHistory(job_id: string, data: Partial<MessageHistory>) {
        const index = this.history.findIndex((i) => i.job_id === job_id)

        if (index > -1) {
            this.history[index] = {
                ...this.history[index],
                ...data
            }
        }
    }

    static randomDelay(): number {
        const minDelay = parseInt(process.env.QUEUE_MIN_DELAY || '2500')
        const maxDelay = parseInt(process.env.QUEUE_MAX_DELAY || '5000')
        return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
    }

    static sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}