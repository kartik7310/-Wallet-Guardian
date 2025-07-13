
import prisma from "../config/db";         
import  {mailSender} from "../config/nodemailer" 
 import { budgetThresholdEmailTemplate } from "../utils/Tamplates/budgetThresholdEmail";
/** ────────── Types ───────────────────────────────────────── */
interface NotifyOptions {
  budgetId: number;        
  userEmail: string;
  userName: string;
  category: string;
  plannedAmount: number;
  spentAmount: number;       
  txnAmount: number;         
  month: number;
  year: number;
  lastLevel: number | null;  
  txnDate: Date;
}

const THRESHOLDS = [50, 75, 90, 100] as const;

export async function notifyBudgetThreshold(opts: NotifyOptions) {
  // 1️  % used *after* adding the new expense
  const percentUsed =
    ((opts.spentAmount + opts.txnAmount) / opts.plannedAmount) * 100;

  // 2️  Find the next threshold crossed but not yet notified
  const nextLevel = THRESHOLDS.find(
    (t) => percentUsed >= t && (opts.lastLevel ?? 0) < t
  );

if (!nextLevel) return;

const { subject, html } = budgetThresholdEmailTemplate({
  userName: opts.userName,
  category: opts.category,
  plannedAmount: opts.plannedAmount,
  percentUsed,
  nextLevel,
  txnDate: opts.txnDate,
});

await mailSender({
  email: opts.userEmail,
  title: subject,
  body: html,
});


  // 4️  Persist new level so we don't spam next time
  await prisma.budget.update({
    where: { id: opts.budgetId },
    data: { lastNotifiedLevel: nextLevel,notified:true},
  });
}
