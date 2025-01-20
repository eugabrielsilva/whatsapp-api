import { Client, LocalAuth, Message } from 'whatsapp-web.js'
import { generate } from 'qrcode-terminal'
import { toUser, logger, getMessageBody } from './format'
import sendHook from './hook'
import AuthHelper from './auth'

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
    timeout: 0
  },
  authStrategy: new LocalAuth(),
  takeoverOnConflict: true
})

client.on('qr', (qr: string) => {
  AuthHelper.setQr(qr)
  logger('auth', 'Scan the QR Code below to connect to WhatsApp:')
  generate(qr, { small: true })
})

client.once('ready', () => {
  const number = toUser(client.info.wid.user)
  logger('auth', `Connected to WhatsApp with ${number}.`)
  logger('auth', 'Client is ready.')
})

client.on('message', async (message: Message) => {
  const hookUrl = process.env.WEBHOOK_URL
  if (!hookUrl?.length) return

  let messageBody = await getMessageBody(message)

  if (messageBody) {
    sendHook(hookUrl, 'message_received', messageBody)
  }
})

export default client
