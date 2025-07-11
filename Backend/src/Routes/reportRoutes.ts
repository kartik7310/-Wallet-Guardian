
// • GET /api/reports/dashboard 
// • GET /api/reports/monthly-summary 
// • GET /api/reports/export?type=pdf|csv

  import  {GenerateTransactionPDF} from  "../Controllers/reportController";
   import auth from "../Middleware/auth";
  import { Router } from "express";

  const router = Router();

  router.get("/transaction/statement", auth, GenerateTransactionPDF);

  // router.post("/resports/monthly-summary", MonthlyReport);

  export default router
