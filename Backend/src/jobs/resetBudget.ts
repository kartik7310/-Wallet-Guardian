
import cron from 'node-cron';
import prisma from '../config/db';
import logger from '../utils/logger';
cron.schedule('0 0 1 * *', async () => { 
  try {
     await prisma.budget.updateMany({
  data: {
    spentAmount: 0,
    notified: false,
    lastNotifiedLevel: null,
  },
});
    logger.info("✅ All budgets reset successfully");

  } catch (error: any) {
    logger.error(" Error :", error.message);
  }
});

