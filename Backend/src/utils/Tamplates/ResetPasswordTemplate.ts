export function passwordResetSuccessTemplate(username?: string): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #2c3e50;">🔐 Password Reset Successful</h2>
      <p>Hello${username ? ` ${username}` : ""},</p>
      <p>We're letting you know that your password has been <strong>successfully changed</strong> on <strong>WalletGuardian</strong>.</p>
      <p>If you did not perform this action, please contact our support team immediately.</p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

      <p style="font-size: 14px; color: #888;">If you reset your password, you can safely ignore this message.</p>
      <p style="margin-top: 30px;">Thanks,<br><strong>The WalletGuardian Team</strong></p>

      <div style="text-align: center; margin-top: 40px;">
        <img src="https://i.ibb.co/Hg6HKqB/shield.png" alt="Shield Icon" width="80" />
      </div>
    </div>
  `;
}
