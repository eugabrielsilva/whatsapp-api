import axios from 'axios'
import { prettyLogger } from './format'

function sendHook(hookUrl: string, type: string, body: any): void {
  axios
    .post(
      hookUrl,
      {
        type,
        ...body
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then(() => {
      prettyLogger('info', `"${type}" hook sent successfully.`)
    })
    .catch((error: Error) => {
      prettyLogger('error', `Failed to sent "${type}" hook.`, error)
    })
}

export default sendHook
