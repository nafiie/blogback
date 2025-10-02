const nodemailer = require("nodemailer")

// Looking to send emails in production? Check out our Email API/SMTP product!
const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass:process.env.MAIL_PASS,
    }
  });

  const sendMail =  async(to, subject, text, html) => {
    try {
        const info = await transport.sendMail({
            from: '"Code Crafter" <no-reply@codecrafter.com>',
            to,
            subject, 
            text,
            html
        });
        console.log('message sent: %s', info.messageId);
        
    } catch (error) {
        console.log('error sending mail', error.message);
        
        
    }
  }

  module.exports = sendMail;