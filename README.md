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

```json
{
  "message": "Hello!"
}
```

### Get chat

`GET /get-chat/{number}`

Retrieves the available chat history of a specific phone number.
