import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import { buildMonthlyStatementPdf } from "../helper/statement";

export async function GenerateTransactionPDF(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id,name,email } = req.user!;
  if (!id) return next(new CustomError("Unauthenticated", 401));

  try {
    const { buffer } = await buildMonthlyStatementPdf(id,name,email);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transaction-statement.pdf"
    );
    return res.end(buffer);
  } catch (err) {
    return next(err);
  }
}
