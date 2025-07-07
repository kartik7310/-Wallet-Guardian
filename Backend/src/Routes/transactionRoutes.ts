
  import  {CreateTransaction,UpdateTransaction,DeleteTransaction,GetAllTransaction} from  "../Controllers/transactionController";

  import { Router } from "express";

  const router = Router();

  router.post("/Add-transaction", CreateTransaction);

  router.get("/get-transactions", GetAllTransaction);

  router.put("/update-transaction", UpdateTransaction);

  router.delete("/delete-transaction", DeleteTransaction);



  export default router