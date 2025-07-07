import { mailSender } from "../config/nodemailer";
import { verifyEmailTemplate } from "./Tamplates/verifyEmailTemplate";
interface EmailType {
  email: string;
  token: string;
}

export async function sendVerificationEmail(emailData: EmailType) {
  if (!emailData.email || !emailData.email.includes("@")) {
    throw new Error("Invalid email address");
  }

  try {
    const res = await mailSender({
      email: emailData.email,
      title: "Verify your email",
      body: verifyEmailTemplate(emailData.token),
    });

    return res;
  } catch (error: any) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}
