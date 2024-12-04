const mail = require('nodemailer');
require("dotenv").config();

const sendEmail = async (to, subject, message) => {
    const transporter = mail.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL,
            pass: process.env.PASSKEY
        }
    });

    const mailOptions = {
        from: process.env.GMAIL,
        to,
        subject,
        text: message
    };

    try{
        await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${to}`);
    }catch(error){
        console.error('Error sending email:', error);
    }
}

module.exports = { sendEmail }