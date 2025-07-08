
  import  {CreateTransaction,UpdateTransaction,DeleteTransaction,GetAllTransaction} from  "../Controllers/transactionController";
  import catchAsync from "../utils/catchAsync";
  import auth from "../Middleware/auth";
  import { Router } from "express";

  const router = Router();

  router.post("/Add-transaction", auth, catchAsync(CreateTransaction));

  router.get("/get-transactions", auth,catchAsync(GetAllTransaction));

  router.put("/update-transaction/:transactionId",auth,catchAsync( UpdateTransaction));

  router.delete("/delete-transaction/:transactionId",auth, catchAsync(DeleteTransaction));



  export default router