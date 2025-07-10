
import cron from 'node-cron';
import prisma from '../config/db';
import logger from '../utils/logger';

cron.schedule('0 6 * * *', async () => { 
  try {
    logger.info("Starting cleanup of expired OTPs");
    const result = await prisma.oTP.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },

      },
    });

    if (result.count > 0) {
      logger.info(`Cleaned ${result.count} expired OTP(s)`);
    }
  } catch (error: any) {
    logger.error(" Error cleaning expired OTPs:", error.message);
  }
});
