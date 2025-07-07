    import dotenv from "dotenv";
    import cors from "cors";
    import helmet from "helmet";
    import morgan from "morgan";
    import cookieParser from "cookie-parser";
    import express from "express";
    import AuthRoute from "./Routes/AuthRoute";
    import UserRoute from "./Routes/userRoute";
    import TransactionRoute from "./Routes/transactionRoutes";
    import ReportRoute from "./Routes/reportRoutes";
    import prisma from "./config/db";
    import logger from "./utils/logger";
    import errorHandler from "./Middleware/errorHandler";
    const app = express();
    dotenv.config();
    const PORT = process.env.PORT||3000;
    
   app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
    app.use(helmet());
    app.use(morgan("dev"));

    app.use(
      cors({
        origin: process.env.FRONTEND_URL,
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

    app.use("/api/v1/report", ReportRoute);

    // // api not found route
    // app.use("*", (req, res) => {
    //   res.status(404).json({
    //     success: false,
    //     message: "API endpoint not found",
    //   });
    // });

    // Global error handler

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
