import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

interface Body {
  email: string;
  title: string;
  body: string;
  attachments?: EmailAttachment[];
}

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_HOST = process.env.SMTP_HOST;
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

    const mailOptions: any = {
      from: `"WalletGuardian" <${SMTP_USER}>`,
      to: EmailData.email,
      subject: EmailData.title,
      html: EmailData.body,
    };

    // ✅ Only add attachments if provided
    if (EmailData.attachments && EmailData.attachments.length > 0) {
      mailOptions.attachments = EmailData.attachments;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${EmailData.email}: ${info.messageId}`);
    return info;

  } catch (error: any) {
    console.error(`❌ Failed to send email to ${EmailData.email}:`, error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
