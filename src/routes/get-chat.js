const express = require('express');
const client = require('../utils/client');
const router = express.Router();

function errorHandler(chatId, error) {
    console.error(`Failed to get chat from ${chatId}.`, error);
    return res.status(500).json({
        status: false,
        error: 'Error getting chat.',
        details: error.message
    });
}

router.get('/:number', (req, res) => {
    const {number} = req.params;

    if(!number) {
        return res.status(400).json({
            status: false,
            error: 'Missing "number" parameter.'
        });
    }

    const chatId = `${number}@c.us`;
    console.log(`Getting chat from ${chatId}...`);

    client.getChatById(chatId).then(chat => {
        chat.fetchMessages().then(messages => {
            const parsedMessages = messages.map(msg => ({
                from: msg.from,
                to: msg.to,
                body: msg.body,
                timestamp: msg.timestamp
            }));

            console.log(`Finished getting chat from ${chatId}.`);

            return res.status(200).json({
                status: true,
                messages: parsedMessages
            });
        }).catch(error => {
            return errorHandler(chatId, error);
        });
    }).catch(error => {
        return errorHandler(chatId, error);
    });
});

module.exports = router;
