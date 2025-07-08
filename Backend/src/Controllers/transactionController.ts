    import { Request,Response,NextFunction } from "express";
   import { transactionSchema,TransactionInput,updateTransactionSchema, transactionSearchSchema } from "../Schemas/transaction";
   import prisma from "../config/db";
   import { CustomError } from "../utils/customError";
import { buildTransactionFilter } from "../helper/searchFilter";
    async function CreateTransaction(req:Request,res:Response,next:NextFunction){
 
        const result = transactionSchema.safeParse(req.body);
        if(!result.success){
            return next(new CustomError('Invalid input',400))
        }
        const userId = req.user?.id;
        if(!userId){
            return next(new CustomError('Unauthorized',401));
        }
        const{type,category,amount,date,note}:TransactionInput = result?.data;
        try {
            const transaction = await prisma.transaction.create({
                data: {
                    type,
                    category,
                    amount,
                    date: new Date(date),
                    note,
                    user: {
                      connect: { id: userId }
                    }
                }
            });
            return res.status(201).json({
                success: true,
                message: "Transaction created successfully",
                data: transaction
            });
        } catch (error) {
            next(error);
        }
    }
   
 async function UpdateTransaction(req: Request, res: Response, next: NextFunction) {
  const result = updateTransactionSchema.safeParse(req.body);
  if (!result.success) {
    return next(new CustomError("Invalid input", 400));
  }

  const { transactionId } = req.params;
  if (!transactionId) {
    return next(new CustomError("Transaction ID not provided", 400));
  }

  const userId = req.user?.id;
  if (!userId) {
    return next(new CustomError("User ID not found in request", 400));
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: Number(transactionId),
      },
    });

    if (!transaction) {
      return next(new CustomError("Transaction not found", 404));
    }

    if (userId !== transaction.userId) {
      return next(new CustomError("Unauthorized to update this transaction", 403));
    }

    const updated = await prisma.transaction.update({
      where: {
        id: Number(transactionId),
      },
      data: {
        ...result.data,
        date: result.data.date ? new Date(result.data.date) : undefined,
      },
    });

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}
   async function DeleteTransaction(req:Request,res:Response,next:NextFunction){
    const {transactionId} = req.params;
    if(!transactionId){
        return next(new CustomError("Transaction id not provide"))
    }
    const userId = req.user?.id;
    if(!userId){
        return next(new CustomError("userId not provide",400))
    }
     try {
        const transaction = await prisma.transaction.findFirst({
            where:{
                id:Number(transactionId)
            }
        })
        if(!transaction){
            return next(new CustomError("Transaction not exist with this Id"))
        }
        if(userId !== transaction.userId){
            return next(new CustomError("You can't delete this transaction"))
        }
        await prisma.transaction.delete({
            where:{
                id:Number(transactionId)
            }
        })
        return res.status(200).json({
            success:true,
            message:"Transaction deleted success"
        })
     } catch (error) {
        next(error)
     }
    }
    
 async function GetAllTransaction(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  if (!userId) return next(new CustomError("User not authenticated", 401));

  const result = transactionSearchSchema.safeParse(req.query);
  if (!result.success) {
    return next(new CustomError("Invalid search parameters", 400));
  }

  try {
    const filters = result.data;
    const whereClause = buildTransactionFilter(userId, filters);

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: {
        date: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
}

export{CreateTransaction,UpdateTransaction,DeleteTransaction,GetAllTransaction}