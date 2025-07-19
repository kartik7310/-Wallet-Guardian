import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import express from "express";
import AuthRoute from "./Routes/AuthRoute";
import UserRoute from "./Routes/userRoute";
import BudgetRoute from "./Routes/budgeRoute";
import TransactionRoute from "./Routes/transactionRoutes";
import ReportRoute from "./Routes/reportRoutes";
import prisma from "./config/db";
import logger from "./utils/logger";
import errorHandler from "./Middleware/errorHandler";
import { startTransactionStatementJob } from "./jobs/transactionStatement";
//cron jobs
import "./jobs/cleanExpiredOtps";
import "./jobs/resetBudget";
startTransactionStatementJob();
const app = express();

const PORT = process.env.PORT;
console.log("port is here",PORT);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use(
  cors({
    origin:"http://loaclhost:3000",
    methods: ["GET,PUT,POST,DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello TypeScript Backend!");
});

app.use("/api/v1/auth", AuthRoute);

app.use("/api/v1/user", UserRoute);

app.use("/api/v1/transaction", TransactionRoute);

app.use("/api/v1/budget", BudgetRoute);

app.use("/api/v1/report", ReportRoute);

app.use(errorHandler);

async function startServer() {

  try {
    await prisma.$connect();
    logger.info("🟢 Connected to DB");
    app.listen(PORT, () =>
     
      
      logger.info(`🚀 Server is running at http://localhost:${PORT}`)
    );
  } catch (err) {
    logger.error("🔴 Failed to start server:", err);
       console.error(err); // <-- Add this to show full error
    process.exit(1);
  }
}
startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  logger.info("🛑 Prisma disconnected");
  process.exit(0);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
