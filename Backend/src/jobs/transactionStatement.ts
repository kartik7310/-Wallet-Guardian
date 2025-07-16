import cron from "node-cron";
import { buildMonthlyStatementPdf } from "../helper/statement";
import { sendTransactionPDFToEmail } from "../utils/verificationEmail";
import logger from "../utils/logger";
import prisma from "../config/db"

export function startTransactionStatementJob() {
  cron.schedule("59 23 30 * *", async () => {
    logger.info("[cron] Sending monthly statements…");
    try {
      const users = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
      for (const user of users) {
        const { buffer } = await buildMonthlyStatementPdf(user.id, user.name, user.email);
        await sendTransactionPDFToEmail(Buffer.from(buffer), user.email, user.name);
        logger.info(`[cron] PDF sent to ${user.email}`);
      }
    } catch (e) {
      logger.error(`[cron] Skipped user `);
    }
    })
}
