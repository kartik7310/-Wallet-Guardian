import dayjs from "dayjs";

interface BudgetThresholdEmailOptions {
  userName: string;
  category: string;
  plannedAmount: number;
  percentUsed: number;
  nextLevel: number;
  txnDate: Date;
}

export function budgetThresholdEmailTemplate(
  opts: BudgetThresholdEmailOptions
): { subject: string; html: string } {
  return {
    subject: `⚠️ ${opts.nextLevel}% of your ${opts.category} budget used`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #f4f6f8; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <h2 style="color: #0f62fe; margin-bottom: 16px;">Wallet Guardian</h2>

        <p style="font-size: 16px;">Hi <strong>${opts.userName}</strong>,</p>

        <p style="font-size: 16px; line-height: 1.6;">
          You've spent <strong>${Math.round(opts.percentUsed)}%</strong> of your 
          <strong>₹${opts.plannedAmount}</strong> budget for <strong>${opts.category}</strong> 
          in <strong>${dayjs(opts.txnDate).format("MMMM YYYY")}</strong>.
        </p>

        <p style="font-size: 16px;">Please keep an eye on your spending. You're doing great! 💡</p>

        <div style="margin-top: 24px;">
          <a href="https://your-app-url.com/dashboard" style="display: inline-block; background-color: #0f62fe; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            View Budget Summary
          </a>
        </div>

        <hr style="margin-top: 32px; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #777;">You are receiving this email because you enabled budget alerts in Wallet Guardian.</p>
      </div>
    `,
  };
}
