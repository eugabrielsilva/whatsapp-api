const express = require('express');
const client = require('../utils/client');
const router = express.Router();

router.post('/', (req, res) => {
    const {number, message} = req.body;

    if(!number) {
        return res.status(400).json({
            status: false,
            error: 'Missing "number" parameter.'
        });
    }

    if(!message) {
        return res.status(400).json({
            status: false,
            error: 'Missing "message" parameter.'
        });
    }

    const chatId = `${number}@c.us`;
    console.log(`Sending message to ${chatId}...`);

    client.sendMessage(chatId, message).then(() => {
        console.log(`Message sent to ${chatId}.`);

        return res.status(200).json({
            status: true,
            message: 'Message sent successfully.'
        });
    }).catch(error => {
        console.error(`Failed to send message to ${chatId}.`, error);

        return res.status(500).json({
            status: false,
            error: 'Error sending message.',
            details: error.message
        });
    });
});

module.exports = router;