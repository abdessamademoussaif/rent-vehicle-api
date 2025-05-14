const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOpts = {
    from: 'EASYTRANS Platform <tewbacshakour@gmail.com>',
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  if (options.pdfBuffer) {
    mailOpts.attachments = [
      {
        filename: 'generated.pdf',
        content: options.pdfBuffer,
        contentType: 'application/pdf',
      },
    ];
  }

  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
