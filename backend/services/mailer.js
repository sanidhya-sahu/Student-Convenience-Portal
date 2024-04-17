require('dotenv').config()
const nodemailer = require('nodemailer');
const smtpConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    },
};
const transporter = nodemailer.createTransport(smtpConfig);
const sendComplainEmail = async (complainId, staffEmail, studentName,email, complainDesc,location, block, status) => {
    let message = {
        from: `SCP - Student Conveniance Portal<${email}>`,
        to: staffEmail,
        subject: `Complain regarding ${block}`,
        text: `Respected Authority,\n\n${studentName} [ ${email} ], has an complain reagrding ${location} - ${block}.\n\nComplain : ${complainDesc}.\n\nComplain ID : ${complainId}.\n\nComplain Status : ${status} 
            `
    };

    transporter.sendMail(message)
        .then(() => {
            return true
        })
        .catch(error => {
            return false
        });
}
const sendReminderComplainEmail = async (complainId, staffEmail, studentName,email, complainDesc,location, block, status) => {
    let message = {
        from: `SCP - Student Conveniance Portal<${email}>`,
        to: staffEmail,
        subject: `Reminder of Complain regarding ${block}`,
        text: `Respected Authority,\n\n${studentName} [ ${email} ], has an complain reagrding ${location} - ${block}.\n\nComplain : ${complainDesc}.\n\nComplain ID : ${complainId}.\n\nComplain Status : ${status} 
            `
    };

    transporter.sendMail(message)
        .then(() => {
            return true
        })
        .catch(error => {
            return false
        });
}
const sendSuggetionEmail = async (regid, description, title) => {
    let message = {
        from: 'AI Club 👍 <sanidhyasahu194@gmail.com>',
        to: "sanidhyasahu2022@vitbhopal.ac.in", // Suggestion respective faculty email
        cc: supervisorEmail,
        subject: title,
        text: `Respected Sir,\n\n ${regid} has an suggestion reagrding ${title}.\n\nDescription :${description}
            `

    };
    transporter.sendMail(message)
        .then(() => {
            console.log("email sent");
            // return true
        })
        .catch(error => {
            console.log("email not sent");
            return false
        });
}
// sendComplainEmail("complain_ID","aneesahu4@gmail.com","sanidhyasahu2022@vitbhopal.ac.in","Sanidhya sahu","22BAI10234","no water in block 1","Boys Hostel Block 1","raised")

module.exports = { sendComplainEmail, sendSuggetionEmail, sendReminderComplainEmail};