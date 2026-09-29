import fs from 'fs'
import path from 'path'
import { logger } from './format'
import client from './client'
import { WAState } from 'whatsapp-web.js'

let isRestarting = false

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

export async function checkClientHealth() {
  // @ts-ignore
  if (!client.isReady || isRestarting) return

  try {
    const state = await client.getState()

    if (state !== WAState.CONNECTED) {
      throw new Error('Client not connected')
    }
  } catch (error) {
    logger('error', 'Client is not healthy. Attempting to restart...', error)

    isRestarting = true

    try {
      await client.destroy()

      // @ts-ignore
      client.isReady = false
      await client.initialize()

      isRestarting = false
    } catch (err) {
      logger('error', 'Failed to restart client. Killing process...', err)
      process.exit(1)
    }
  }
}