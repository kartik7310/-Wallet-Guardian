
import cron from 'node-cron';
import prisma from '../config/db';

cron.schedule('*/10 * * * *', async () => { 
  try {
      console.log("hi there how are you");
    const result = await prisma.oTP.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    if (result.count > 0) {
      console.log(`Cleaned ${result.count} expired OTP(s)`);
    }
  } catch (error: any) {
    console.error(" Error cleaning expired OTPs:", error.message);
  }
});
