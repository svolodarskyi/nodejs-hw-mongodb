import nodemailer from 'nodemailer';
import createError from 'http-errors';
import { getEnvVar } from './getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: getEnvVar('SMTP_HOST'),
  port: getEnvVar('SMTP_PORT'),
  secure: getEnvVar('SMTP_PORT') == 465,
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: getEnvVar('SMTP_FROM'),
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error.message);
    throw createError(500, 'Failed to send the email, please try again later.');
  }
};

export default sendMail;