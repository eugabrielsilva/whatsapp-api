import { RetryOptions } from "../@types/other"
import { restartClient } from "./cron"
import { logger } from "./format"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default async function retry<T>(
    callback: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const { maxRetries = 2, delayMs = 1500 } = options
    let attempt = 0

    while (attempt < maxRetries) {
        try {
            return await callback()
        } catch (error) {
            attempt++

            if (attempt >= maxRetries) {
                logger('error', `Max retries (${maxRetries}) reached. Throwing error.`, error)
                throw error
            }

            logger('warning', `Attempt ${attempt} failed. Restarting client and retrying in ${delayMs}ms...`)

            await restartClient()
            await sleep(delayMs * attempt)
        }
    }

    throw new Error('Unexpected retry loop exit')
}