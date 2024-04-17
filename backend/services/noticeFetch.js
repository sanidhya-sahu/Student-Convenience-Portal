require('dotenv').config()
const { query } = require('express')
const { google } = require('googleapis')

const CLIENT_ID = process.env.CLIENT_ID
const SECRET_ID = process.env.SECRET_ID
const REDIRECT = process.env.REDIRECT
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, SECRET_ID, REDIRECT)
// const token = process.env.SERVICE_TOKEN
const mailQuery = "to:allstudents@vitbhopal.ac.in"

oauth2Client.setCredentials(token)

async function listMessages(auth, query = mailQuery) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({
        userId: 'me',
        q: query, // Optional query string to filter messages (e.g., label:inbox)
    });
    return res.data.messages;
}

async function getMessage(auth, messageId) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
    });
    return res.data;
}

async function parseMessageParts(parts) {
    for (const part of parts) {
        if (part.mimeType === 'text/plain') {
            const decodedData = Buffer.from(part.body.data, 'base64').toString('utf-8');
            console.log('Message body:', decodedData);
            return { data: decodedData, stat: true } // Assuming only interested in the first text/plain part
        }
    }

    console.log('No text/plain parts found in the message.');
    return { data: "blahh", stat: false }
}

async function readMail(auth) {
    const messages = await listMessages(auth);
    if (messages.length === 0) {
        console.log('No messages found.');
        return;
    }
    const messageId = messages[0].id; // Read the first message
    const message = await getMessage(auth, messageId);
    // console.log(message);
    // Check for message parts (e.g., text, attachments)
    if (message.payload.parts) {
        const data = await parseMessageParts(message.payload.parts)
        if (data.stat == true) {
            return data.data
        }
        else {
            // const decodedData = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
            // console.log('Message body:', decodedData); // Process the raw message body
            return message.snippet
        }
    }
}

readMail(oauth2Client)