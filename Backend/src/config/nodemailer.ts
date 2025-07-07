import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

interface Body {
  email: string;
  title: string;
  body: string;
}

// You can either use environment variables or hardcoded values — not both.
const SMTP_USER = process.env.SMTP_USER ;
const SMTP_PASS = process.env.SMTP_PASS ;
const SMTP_HOST = process.env.SMTP_HOST ;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465");

export const mailSender = async (EmailData: Body) => {
  try {
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_PASS || !SMTP_USER) {
      throw new Error("Missing mail environment variables");
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for others
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"WalletGuardian" <${SMTP_USER}>`,
      to: EmailData.email,
      subject: EmailData.title,
      html: EmailData.body,
    });

    console.log(`✅ Email sent to ${EmailData.email}: ${info.messageId}`);
    return info;
  } catch (error: any) {
    console.error(`❌ Mail send failed: ${error.message}`);
    throw error;
  }
};
