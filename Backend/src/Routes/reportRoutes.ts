
// • GET /api/reports/dashboard 
// • GET /api/reports/monthly-summary 
// • GET /api/reports/export?type=pdf|csv

  import  {GenerateTransactionPDF} from  "../Controllers/reportController";
   import auth from "../Middleware/auth";
  import { Router } from "express";
import catchAsync from "../utils/catchAsync";

  const router = Router();

  router.get("/transaction/statement", auth, catchAsync(GenerateTransactionPDF));


  export default router
