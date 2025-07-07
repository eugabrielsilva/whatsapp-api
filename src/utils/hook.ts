import axios from 'axios'
import { logger } from './format'

function sendHook(hookUrl: string, type: string, body: any): void {
  const token = process.env.WEBHOOK_SECRET || ''
  axios
    .post(
      hookUrl,
      {
        type,
        data: body
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    )
    .then(() => {
      logger('info', `"${type}" hook sent successfully.`)
    })
    .catch((error: Error) => {
      logger('error', `Failed to sent "${type}" hook.`, error)
    })
}

export default sendHook
