// Dependencies
import dotenv from 'dotenv'
import express from 'express'
import validateToken from './utils/validate-token'
import { logger } from './utils/format'

dotenv.config()
const app = express()

// Middlewares
app.use(express.json())
app.use(validateToken)

// Auth token warning
if (!process?.env?.AUTH_TOKEN?.length) {
  logger('warning', 'API endpoints are not properly protected using an AUTH_TOKEN env variable. This is not recommended in a production server.')
}

// Routes
import sendMessageRoute from './routes/send-message'
app.use('/send-message', sendMessageRoute)

import getChatRoute from './routes/get-chat'
app.use('/get-chat', getChatRoute)

import sendMediaRoute from './routes/send-media'
app.use('/send-media', sendMediaRoute)

// Server
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger('info', `Server started at http://localhost:${PORT}.`)
  logger('auth', 'Please wait to establish connection...')
})
