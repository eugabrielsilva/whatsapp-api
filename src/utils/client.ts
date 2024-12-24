import { Client, LocalAuth, Message } from 'whatsapp-web.js'
import { generate } from 'qrcode-terminal'
import { toUser } from './format'
import sendHook from './hook'

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  authStrategy: new LocalAuth(),
  qrMaxRetries: 3,
  takeoverOnConflict: true
})

client.on('qr', (qr: string) => {
  console.warn('[AUTH] Scan the QR Code to connect to WhatsApp:')
  generate(qr, { small: true })
})

client.once('ready', () => {
  const number = toUser(client.info?.wid?.user || '')
  console.log(`[AUTH] Connected to WhatsApp with ${number}.`)
  console.log('[INFO] Client is ready.')
})

client.once('remote_session_saved', () => {
  console.log('[AUTH] Login saved. It will be restored in the next session.')
})

client.on('message', (message: Message) => {
  const hookUrl = process.env.WEBHOOK_URL
  if (!hookUrl?.length) return

  sendHook(hookUrl, 'message_received', {
    // Add necessary fields here
  })
})

client.initialize()

export default client
