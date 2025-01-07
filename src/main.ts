// Dependencies
import dotenv from 'dotenv'
import express from 'express'
import validateToken from './utils/validate-token'
import path from 'path'
import { logger } from './utils/format'

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
import sendMessageRoute from './routes/send-message'
app.use('/send-message', sendMessageRoute)

import getChatRoute from './routes/get-chat'
app.use('/get-chat', getChatRoute)

import sendMediaRoute from './routes/send-media'
app.use('/send-media', sendMediaRoute)

import sendLocationRoute from './routes/send-location'
app.use('/send-location', sendLocationRoute)

import getProfileRoute from './routes/get-profile'
app.use('/get-profile', getProfileRoute)

import testHookRoute from './routes/test-hook'
app.use('/test-hook', testHookRoute)

// Server
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger('info', `Server started at http://localhost:${PORT}.`)
  logger('auth', 'Please wait to establish connection...')
})
