import nodemailer from 'nodemailer';
import { ServerConfig } from './index.ts';

const transporter = nodemailer.createTransport({
  host: ServerConfig.SMTP_HOST,
  port: Number(ServerConfig.SMTP_PORT),
  secure: ServerConfig.SMTP_SECURE, // true for 465, false for other ports
  auth: {
    user: ServerConfig.SMTP_USER, //sender email id
    pass: ServerConfig.SMTP_PASS, 
  },
});

export default transporter;