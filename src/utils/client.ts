import { Client, LocalAuth, Message } from 'whatsapp-web.js'
import { generate } from 'qrcode-terminal'
import { toUser, logger, getMessageBody } from './format'
import sendHook from './hook'
import AuthHelper from './auth'

const client = new Client({
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-features=MemorySaverMode',
      '--disable-extensions',
      '--disable-software-rasterizer',
      '--mute-audio',
      '--disable-default-apps',
      '--disable-sync',
      '--disable-translate',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-hang-monitor',
    ],
    executablePath: process.env.CHROME_PATH || undefined
  },
  authStrategy: new LocalAuth(),
  takeoverOnConflict: true,
  ffmpegPath: process.env.FFMPEG_PATH || undefined
})

client.on('qr', (qr: string) => {
  AuthHelper.setQr(qr)
  logger('auth', 'Scan the QR Code below to connect to WhatsApp:')
  generate(qr, { small: true })
})

client.on('ready', () => {
  const number = toUser(client.info.wid.user)
  logger('auth', `Connected to WhatsApp with ${number}.`)
  logger('auth', 'Client is ready.')
})

client.on('auth_failure', (error: string) => {
  logger('error', 'Authentication failed. Please try again.', error)
})

client.on('authenticated', () => {
  logger('auth', 'Successfully authenticated.')
})

client.on('disconnected', (reason: string) => {
  logger('auth', 'Client disconnected.', reason)
})

client.on('message', async (message: Message) => {
  const hookUrl = process.env.WEBHOOK_URL
  if (!hookUrl?.length) return

  const messageBody = await getMessageBody(message)

  if (messageBody) {
    sendHook(hookUrl, 'message_received', messageBody)
  }
})

export default client
