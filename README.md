# WhatsApp API Server

A simple HTTP server that wraps an unofficial free WhatsApp API. This project utilizes [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) under the hood to create a WhatsApp client.

## Usage

1. Install the dependencies by running `npm install`.
2. Copy the `.env.example` file and rename it to `.env`.
3. Start the server by running `npm start`.
4. Scan the QR code displayed in the terminal using the WhatsApp app on your phone. Your session will be saved.
5. The server will be accessible at `http://localhost:3000` or at another port you specify.

## Endpoint protection

Endpoints can be protected using an auth token. **This is highly recommended in a production environment.**

#### Setup

Add the `AUTH_TOKEN` string to your `.env` file.

#### Usage

Include the Authorization header in all endpoint requests with your token.

`Authorization: Bearer [AUTH_TOKEN]`

## Endpoints

### Send message

`POST /send-message/{number}`

Sends a message to a specific phone number.

Phone must be in international format, with the country code, area code and only numbers. E.g.: `551112345678`.

Request body must be in JSON:

```jsonc
{
  "message": "Hello!" // required
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

### Send location

`POST /send-location/{number}`

Sends a location pin to a specific phone number.

Request body must be in JSON:

```jsonc
{
  "latitude": 48.85846, // required
  "longitude": 2.29447, // required
  "address": "Optional address to send with the location",
  "url": "https://optionalurl.com"
}
```

### Get chats

`GET /get-chats`

Gets the list of all chats.

### Get chat

`GET /get-chat/{number}`

Retrieves the available chat history of a specific phone number.

### Get profile

`GET /get-profile/{number}`

Retrieves the user data of a specific phone number.
