// Dependencies
import dotenv from 'dotenv'
import express from 'express'
import validateToken from './utils/validate-token'
import path from 'path'
import { logger } from './utils/format'
import cron from 'node-cron'
import clearMediaCron from './utils/cron'
import client from './utils/client'
import { AppRouter } from './router'

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

// Initialize router
new AppRouter(app)

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
