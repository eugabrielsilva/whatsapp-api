// Dependencies
import dotenv from 'dotenv'
import express from 'express'
import validateToken from './utils/validate-token'
import path from 'path'
import { logger } from './utils/format'
import sendMessageRoute from './routes/send-message'
import getChatRoute from './routes/get-chat'
import sendMediaRoute from './routes/send-media'
import sendLocationRoute from './routes/send-location'
import getProfileRoute from './routes/get-profile'
import testHookRoute from './routes/test-hook'
import getChatsRoute from './routes/get-chats'
import loginRoute from './routes/login'
import logoutRoute from './routes/logout'
import checkLoginRoute from './routes/check-login'
import getContactsRoute from './routes/get-contacts'
import getMeRoute from './routes/get-me'
import cron from 'node-cron'
import clearMediaCron from './utils/cron'
import client from './utils/client'

dotenv.config()
const app = express()

// Middlewares
app.use(express.json())
app.use(validateToken)
app.use(express.static(path.join(process.cwd(), 'public')))

// Auth token warning
if (!process?.env?.AUTH_TOKEN?.length) {
  logger('warning', 'API endpoints are not properly protected using an AUTH_TOKEN env variable. This is not recommended in a production server.')
}

// Routes
app.use('/login', loginRoute)
app.use('/logout', logoutRoute)
app.use('/send-message', sendMessageRoute)
app.use('/get-chat', getChatRoute)
app.use('/send-media', sendMediaRoute)
app.use('/send-location', sendLocationRoute)
app.use('/get-profile', getProfileRoute)
app.use('/get-chats', getChatsRoute)
app.use('/get-contacts', getContactsRoute)
app.use('/get-me', getMeRoute)
app.use('/test-hook', testHookRoute)
app.use('/check-login', checkLoginRoute)

// Server
const HOST = process.env.HOST || 'http://localhost'
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger('info', `Server started at ${HOST}:${PORT}.`)
  logger('auth', 'Please wait to establish connection...')

  // Initialize client
  client.initialize()

  // Cron jobs
  cron.schedule('*/30 * * * *', clearMediaCron)
})
