const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    host: "smtp.mailtrap.io",
    // port: process.env.SMTP_PORT,
    port: 2525,
    auth: {
    //   user: process.env.SMTP_EMAIL,
    //   pass: process.env.SMTP_PASSWORD
      user: "43abc65bcd3615",
      pass: "92b358cc9b6ceb"
    }
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
