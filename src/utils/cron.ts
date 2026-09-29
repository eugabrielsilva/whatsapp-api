import fs from 'fs'
import path from 'path'
import { logger } from './format'
import client from './client'
import { WAState } from 'whatsapp-web.js'

let isRestarting = false
let restartPromise: Promise<void> | null = null

export function clearMediaCron() {
  const folderPath = path.join(process.cwd(), 'public/media')
  const files = fs.readdirSync(folderPath)
  if (files.length <= 1) return

  const now = Date.now()
  const hours24Millis = 24 * 60 * 60 * 1000
  let count = 0

  files.forEach((file: string) => {
    if (file !== '.gitignore') {
      const filePath = path.join(folderPath, file)
      const stats = fs.statSync(filePath)
      if (now - stats.mtimeMs > hours24Millis) {
        fs.rmSync(filePath, { force: true })
        count++
      }
    }
  })

  logger('info', `Cleared ${count} media files.`)
}

export async function restartClient() {
  if (isRestarting && restartPromise) return restartPromise
  isRestarting = true

  restartPromise = (async () => {
    try {
      await client.destroy()

      // @ts-ignore
      client.isReady = false

      await client.initialize()
    } catch (error: any) {
      logger('error', 'Failed to restart client. Killing process...', error)
      process.exit(1)
    } finally {
      isRestarting = false
      restartPromise = null
    }
  })()

  return restartPromise
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
  )
  return Promise.race([promise, timeout])
}

export async function checkClientHealth() {
  // @ts-ignore
  if (!client || !client.isReady) {
    logger('warning', 'Client is not ready or unitialized during health check.')
    return
  }

  try {
    const state = await withTimeout(client.getState(), 30000)

    if (state !== WAState.CONNECTED) {
      throw new Error(`Client in invalid state: ${state}`)
    }
  } catch (error: any) {
    logger('error', 'Client health check failed. Attempting to restart...', error)
    await restartClient()
  }
}