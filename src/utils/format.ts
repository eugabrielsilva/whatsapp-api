import { Message } from 'whatsapp-web.js'

function toClient(phone: string): string {
  return phone.replace(/\D/g, '') + '@c.us'
}

function toUser(phone: string): string {
  return '+' + phone.replace('@c.us', '')
}

function toDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

function parseTextMessage(message: Message) {
  return {
    id: message.id.id,
    type: message.type,
    from: toUser(message.from),
    to: toUser(message.to),
    body: message.body,
    date: toDate(message.timestamp),
    isTemporary: message.isEphemeral,
    isForwarded: message.isForwarded
  }
}

function logger(type: string, message: string, ...optionalParams: any[]) {
  const colors = {
    reset: '\x1b[0m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m'
  }

  switch (type) {
    case 'warning':
      console.warn(`${colors.yellow}[WARNING] ${message}${colors.reset}`, ...optionalParams)
      break
    case 'auth':
      console.log(`${colors.magenta}[AUTH] ${message}${colors.reset}`, ...optionalParams)
      break
    case 'error':
      console.error(`${colors.red}[ERROR] ${message}${colors.reset}`, ...optionalParams)
      break
    case 'info':
      console.log(`${colors.blue}[INFO] ${message}${colors.reset}`, ...optionalParams)
      break
    default:
      break
  }
}

export { toClient, toUser, toDate, parseTextMessage, logger }
