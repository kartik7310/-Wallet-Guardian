
// • GET /api/reports/dashboard 
// • GET /api/reports/monthly-summary 
// • GET /api/reports/export?type=pdf|csv

  import  {Dashboard,MonthlyReport} from  "../Controllers/reportController";

  import { Router } from "express";

  const router = Router();

  router.post("/resports/dashboard", Dashboard);

  router.post("/resports/monthly-summary", MonthlyReport);

  export default router
