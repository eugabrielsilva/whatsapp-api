const {Client, LocalAuth} = require('whatsapp-web.js');
const {generate} = require('qrcode-terminal');

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('Scan the QR Code to connect to WhatsApp:');
    generate(qr, {small: true});
});

client.once('ready', () => {
    console.log(`Connected to WhatsApp with +${client.info.wid.user}.`);
    console.log('Client is ready.');
});

client.initialize();

module.exports = client;