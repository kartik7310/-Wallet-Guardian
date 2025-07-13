import cron from "node-cron";
import prisma from "../config/db";
import {generateBankStatementHTML} from "../utils/Tamplates/pdfFotmat";
import { browserPromise } from "../utils/puppeteer";
import { sendTransactionPDFToEmail } from "../utils/verificationEmail";
import logger from "../utils/logger";
import { Category } from "../../generated/prisma";

export function startTransactionStatementJob() {
  return cron.schedule("0 0 */30 * *", async () => {
    logger.info("[cron] Running daily statement job...");

    const users = await prisma.user.findMany(); // adjust filter if needed

    for (const user of users) {
      const transactions = await prisma.transaction.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
      });

      const cleaned = transactions.map((t:any) => ({
        date: t.date,
        note: t.note ?? undefined,
        type: t.type,
        amount: t.amount,
        category: t.category as Category,
      }));

      const html = generateBankStatementHTML(cleaned, {
        email: user.email,
        name: user.name,
      });

      const browser = await browserPromise;
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
      await page.close();

      await sendTransactionPDFToEmail(Buffer.from(pdfBuffer), user.email, user.name);
      logger.info(`[cron] PDF sent to ${user.email}`);
    }
  });
}
