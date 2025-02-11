import { Application, Router } from 'express'
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
import searchMessagesRoute from './routes/search-messages'
import getMeRoute from './routes/get-me'
import setOfflineRoute from './routes/set-offline'
import setOnlineRoute from './routes/set-online'
import infoRoute from './routes/info'

const ROUTES: [string, Router][] = [
  ['/login', loginRoute],
  ['/logout', logoutRoute],
  ['/send-message', sendMessageRoute],
  ['/get-chat', getChatRoute],
  ['/send-media', sendMediaRoute],
  ['/send-location', sendLocationRoute],
  ['/get-profile', getProfileRoute],
  ['/get-chats', getChatsRoute],
  ['/get-contacts', getContactsRoute],
  ['/get-me', getMeRoute],
  ['/set-offline', setOfflineRoute],
  ['/set-online', setOnlineRoute],
  ['/search-messages', searchMessagesRoute],
  ['/test-hook', testHookRoute],
  ['/check-login', checkLoginRoute],
  ['/info', infoRoute]
]

export class AppRouter {
  constructor(app: Application) {
    ROUTES.forEach(([path, handler]) => {
      app.use(path, handler)
    })
  }
}
