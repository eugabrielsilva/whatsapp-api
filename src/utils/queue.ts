import { logger } from "./format"

type Job = {
    callback: () => Promise<void>
    delay: number
}

export default class Queue {
    static jobs: Job[] = []
    static running = false

    static add(callback: () => Promise<void>): void {
        this.jobs.push({
            callback,
            delay: this.randomDelay()
        })

        this.run()
    }

    static async run(): Promise<void> {
        if (this.running || this.jobs.length === 0) {
            return
        }

        this.running = true

        while (this.jobs.length > 0) {
            try {
                const job = this.jobs.shift()!
                await this.sleep(job.delay)
                await job.callback()
            } catch (error) {
                logger('error', 'Failed to process queue job:', error)
            }
        }

        this.running = false
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