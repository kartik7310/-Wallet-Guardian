export function verifyEmailTemplate(token: string, username?: string): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9;">
      <div style="text-align: center;">
        <img 
          src="https://cdn.pixabay.com/photo/2017/08/30/07/52/email-2693419_960_720.png" 
          alt="Email Verification" 
          style="max-width: 150px; margin-bottom: 20px;" 
        />
      </div>
      <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
      <p>Hello${username ? ` ${username}` : ""},</p>
      <p>Thank you for registering with <strong>WalletGuardian</strong>.</p>
      <p>Your verification code is:</p>
      <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #007bff; text-align: center;">
        ${token}
      </div>
      <p>This code will expire in 5 minutes. Please do not share it with anyone.</p>
      <hr style="margin: 30px 0;" />
      <p style="text-align: center;">Need help? Contact support at <a href="mailto:support@walletguardian.com">support@walletguardian.com</a></p>
      <p style="text-align: center; font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} WalletGuardian. All rights reserved.</p>
    </div>
  `;
}
