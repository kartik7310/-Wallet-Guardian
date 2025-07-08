export function verifyEmailTemplate(token: string, username?: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding: 20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; font-family: Arial, sans-serif; color:#333333; border: 1px solid #dddddd;">
            
            <!-- Logo Header with Gradient and Left-Aligned Logo -->
            <tr>
              <td align="left" style="background: linear-gradient(to right, #007bff, #00c6ff); padding: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="left" style="vertical-align: middle;">
                      <a href="https://chatgpt.com/s/m_686cfc47d208819186dee1acb85d598b" target="_blank" style="text-decoration: none;">
                        <img src="https://chatgpt.com/s/m_686cfc47d208819186dee1acb85d598b" alt="WalletGuardian Logo" width="40" height="40" style="display: inline-block; border-radius: 50%; vertical-align: middle; margin-right: 10px;" />
                      </a>
                      <span style="font-size: 24px; color: #ffffff; font-weight: bold; vertical-align: middle;">WalletGuardian</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td align="center" style="padding: 20px;">
                <h2 style="color: #2c3e50; margin: 0;">Verify Your Email</h2>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding: 20px; font-size: 16px;">
                <p>Hello${username ? ` <strong>${username}</strong>` : ""},</p>
                <p>Thank you for signing up with <strong>WalletGuardian</strong>.</p>
                <p>Your verification code is:</p>

                <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; color: #007bff; margin: 20px 0;">
                  ${token}
                </div>

                <p>This code will expire in <strong>5 minutes</strong>. Please do not share it with anyone.</p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding: 0 20px;">
                <hr style="border: none; border-top: 1px solid #cccccc;" />
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 20px; font-size: 14px; text-align: center;">
                Need help? <a href="mailto:support@walletguardian.com" style="color: #007bff; text-decoration: none;">Contact Support</a>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 20px 20px; text-align: center; font-size: 12px; color: #999999;">
                &copy; ${new Date().getFullYear()} WalletGuardian. All rights reserved.
              </td>
            </tr>
          
          </table>
        </td>
      </tr>
    </table>
  `;
}
