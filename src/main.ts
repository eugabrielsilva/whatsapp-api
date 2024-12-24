// Dependencies
import dotenv from 'dotenv'
import express from 'express'
import validateToken from './utils/validate-token'
import { prettyLogger } from './utils/format'

dotenv.config()
const app = express()

// Middlewares
app.use(express.json())
app.use(validateToken)

// Auth token warning
if (!process?.env?.AUTH_TOKEN?.length) {
  prettyLogger('warning', 'API endpoints are not properly protected using an AUTH_TOKEN env variable. This is not recommended in a production server.')
}

// Routes
import sendMessageRoute from './routes/send-message'
app.use('/send-message', sendMessageRoute)

import getChatRoute from './routes/get-chat'
app.use('/get-chat', getChatRoute)

// Server
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  prettyLogger('info', `Server started at http://localhost:${PORT}.`)
  prettyLogger('auth', 'Please wait to establish connection...')
})
