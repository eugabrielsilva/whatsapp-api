// Dependencies
require('dotenv').config();
const express = require('express');
const app = express();
const validateToken = require('./utils/validate-token');

// Middlewares
app.use(express.json());
app.use(validateToken);

// Routes
const sendMessageRoute = require('./routes/send-message');
app.use('/send-message', sendMessageRoute);

const getChatRoute = require('./routes/get-chat');
app.use('/get-chat', getChatRoute);

// Server
app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}.`);
    console.log('Please wait to establish connection...');
});