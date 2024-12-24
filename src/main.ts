// Dependencies
import dotenv from 'dotenv'
import express from 'express'
import validateToken from './utils/validate-token'

dotenv.config()
const app = express()

// Middlewares
app.use(express.json())
app.use(validateToken)

// Auth token warning
if (!process?.env?.AUTH_TOKEN?.length) {
  console.warn('[WARNING] API endpoints are not properly protected using an AUTH_TOKEN env variable. This is highly recommended.')
}

// Routes
import sendMessageRoute from './routes/send-message'
app.use('/send-message', sendMessageRoute)

import getChatRoute from './routes/get-chat'
app.use('/get-chat', getChatRoute)

// Server
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`[INFO] Server started at http://localhost:${PORT}.`)
  console.log('[AUTH] Please wait to establish connection...')
})
