import fs from 'fs'
import path from 'path'
import { logger } from './format'

function clearMediaCron() {
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

export default clearMediaCron
