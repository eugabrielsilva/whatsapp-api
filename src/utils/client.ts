import { Client, LocalAuth, Message, MessageTypes } from 'whatsapp-web.js'
import { generate } from 'qrcode-terminal'
import { parseTextMessage, toUser, prettyLogger } from './format'
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
  prettyLogger('auth', 'Scan the QR Code below to connect to WhatsApp:')
  prettyLogger('auth', `Raw QR Code: ${qr}`)
  generate(qr, { small: true })
})

client.once('ready', () => {
  const number = toUser(client.info.wid.user)
  prettyLogger('auth', `Connected to WhatsApp with ${number}.`)
  prettyLogger('auth', 'Client is ready.')
})

client.on('message', (message: Message) => {
  const hookUrl = process.env.WEBHOOK_URL
  if (!hookUrl?.length) return

  if (message.type === MessageTypes.TEXT) {
    sendHook(hookUrl, 'message_received', parseTextMessage(message))
  }
})

client.initialize()

export default client
