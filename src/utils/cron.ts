import fs from 'fs'
import path from 'path'
import { logger } from './format'

function clearMediaCron() {
  const folderPath = path.join(process.cwd(), 'public/media')
  const files = fs.readdirSync(folderPath)
  if (files.length <= 1) return

  files.forEach(file => {
    if (file !== '.gitignore') {
      const filePath = path.join(folderPath, file)
      fs.rmSync(filePath, { force: true })
    }
  })

  logger('info', `Cleared ${files.length - 1} media files.`)
}

export default clearMediaCron
