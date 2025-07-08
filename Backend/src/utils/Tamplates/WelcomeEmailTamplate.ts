export function welcomeEmailTemplate(username: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f7f9fc; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <div style="text-align: center;">
        <img src="https://i.imgur.com/welcome-image.png" alt="Welcome" style="max-width: 150px; margin-bottom: 20px;" />
        <h2 style="color: #2c3e50;">Welcome to <span style="color: #007bff;">WalletGuardian</span>!</h2>
      </div>

      <p style="color: #333;">Hi <strong>${username}</strong>,</p>
      
      <p>We’re thrilled to have you onboard 🎉</p>
      <p>Start tracking your expenses, creating budgets, and gaining control over your finances with WalletGuardian.</p>

      <div style="margin: 30px 0; text-align: center;">
        <a href="https://your-frontend-url.com/dashboard" style="background-color: #007bff; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
      </div>

      <p style="color: #555;">If you have any questions or need help, feel free to contact our support team.</p>
      
      <p style="margin-top: 40px;">Warm regards,<br><strong>WalletGuardian Team</strong></p>
    </div>
  `;
}
