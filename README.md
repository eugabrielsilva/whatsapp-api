# WhatsApp API Server

A simple HTTP server that wraps an unofficial free WhatsApp API. This project utilizes [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) under the hood to create a WhatsApp client. No need for a developer account or an API key.

## Usage

1. Install the dependencies by running `npm install`.
2. Copy the `.env.example` file and rename it to `.env`.
3. Start the server by running `npm start`.
4. Scan the QR code displayed in the terminal using the WhatsApp app on your phone. Your session will be saved.
5. The server will be accessible at `http://localhost:3000` or at another port you specify.

## Endpoint protection

Endpoints can be protected using an auth token. **This is highly recommended in a production environment.**

#### Setup

Add the `AUTH_TOKEN` string to your `.env` file. We suggest using a SHA-512 token.

#### Usage

Include the Authorization header in all endpoint requests with your token.

`Authorization: Bearer [AUTH_TOKEN]`

## Endpoints

### Login

`GET /login`

Used to connect to WhatsApp if you are not able to scan the QR Code in the terminal. This will retrieve the QR Code data.

You can pass an optional `?render=1` parameter in the URL to get the QR Code rendered as PNG.

**Note:** The QR Code expires and refreshes itself every 15 seconds. You must request the login route again to get a new valid code.

### Send message

`POST /send-message/{number}`

Sends a message to a specific phone number.

Phone must be in international format, with the country code, area code and only numbers. E.g.: `551112345678`.

Request body must be in JSON:

```jsonc
{
  "message": "Hello!", // required
  "reply_to": "MESSAGE_ID" // (optional) ID of another message to quote as reply
}
```

### Send media

`POST /send-media/{number}`

Sends a media file to a specific phone number.

Request must be in `multipart/form-data` format.

**Form fields:**

| Parameter     | Description                          | Type    |
| ------------- | ------------------------------------ | ------- |
| `file`        | Media file to be sent **(required)** | Blob    |
| `message`     | Caption to send with the media       | string  |
| `view_once`   | Send media as view once              | boolean |
| `as_document` | Send media as document               | boolean |
| `as_voice`    | Send audio file as voice message     | boolean |
| `as_gif`      | Send video file as GIF               | boolean |
| `as_sticker`  | Send image file as sticker           | boolean |
| `reply_to`    | ID of another message to quote       | string  |

### Send location

`POST /send-location/{number}`

Sends a location pin to a specific phone number.

Request body must be in JSON:

```jsonc
{
  "latitude": 48.85846, // required
  "longitude": 2.29447, // required
  "address": "Optional address to send with the location", // (optional)
  "url": "https://optionalurl.com", // (optional),
  "reply_to": "MESSAGE_ID" // (optional) ID of another message to quote as reply
}
```

### Get chats

`GET /get-chats`

Gets the list of all chats.

### Get chat

`GET /get-chat/{number}`

Retrieves the available chat history of a specific phone number. Messages will be sorted in descending order.

You can pass an optional `?limit=` parameter in the URL to limit the maximum number of messages to fetch.

### Search messages

`GET /search-messages`

Searches for messages in the user chats.

**URL query parameters:**

| Parameter | Description                                   | Type   |
| --------- | --------------------------------------------- | ------ |
| `query`   | Search query **(required)**                   | string |
| `limit`   | Max number of messages to fetch               | number |
| `page`    | Page number to fetch                          | number |
| `number`  | Phone number to search inside a specific chat | string |

### Get profile

`GET /get-profile/{number}`

Retrieves the user data of a specific phone number.

### Get contacts

`GET /get-contacts`

Retrieves a list of all saved contacts.

### Get current user

`GET /get-me`

Retrieves the current connected user.

### Set online

`POST /set-online`

Sets the user presence status to online.

### Set offline

`POST /set-offline`

Sets the user presence status to offline.

### Check login status

`GET /check-login`

Checks if the client is connected and WhatsApp is online.

### Logout

`POST /logout`

Disconnects the WhatsApp session. **A server restart will be required to reconnect.**

## Webhooks

### Setup

Add the `WEBHOOK_URL` in the `.env` file.

This URL will receive a `POST` request whenever a new message is received.

The request body will be in JSON in the following format:

```jsonc
"type": "message_received",
"data": {
    // message data
}
```

### Testing

You can test the webhook behavior by routing the URL to the server itself:

`WEBHOOK_URL=http://localhost:3000/test-hook`

Whenever a webhook is received in this URL, the request body will be logged into the console.

## Credits

API Developed by [Gabriel Silva](https://github.com/eugabrielsilva).

Special thanks to [Pedro Lopez](https://github.com/pedroslopez) for the WA client.
