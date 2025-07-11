import { mailSender } from "../config/nodemailer";
import { generateBankStatementHTML } from "./Tamplates/pdfFotmat";
import { passwordResetSuccessTemplate } from "./Tamplates/ResetPasswordTemplate";
import { verifyEmailTemplate } from "./Tamplates/verifyEmailTemplate";
import { welcomeEmailTemplate } from "./Tamplates/WelcomeEmailTamplate";
interface EmailType {
  email: string;
  token: string;
}

//verification email
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

//Welcome email
export async function welcomeEmail(userName:string,email:string) {
  try {
    const res = await mailSender({
      email: email,
      title: "Welcome to WalletGuardian",
      body: welcomeEmailTemplate(userName),
    });

    return res;
  } catch (error: any) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}
//reset password success email
export async function ResetPasswordSuccess(userName:string,email:string) {
  try {
    const res = await mailSender({
      email: email,
      title: "Password Reset Confirmation - WalletGuardian",
      body: passwordResetSuccessTemplate(userName),
    });

    return res;
  } catch (error: any) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}
export async function sendTransactionPDFToEmail(pdfBuffer: Buffer, email: string,name:string) {
  try {
    await mailSender({
      email: email,
      title: "Your Statement",
      body: `<p>Attached is your monthly statement, ${name}.</p>`,
  attachments: [
    {
      filename: "statement.pdf",
      content: pdfBuffer,
      contentType: "application/pdf",
    },
  ],
});

  } catch (error: any) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}
