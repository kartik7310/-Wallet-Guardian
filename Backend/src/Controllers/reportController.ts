
import { generateBankStatementHTML } from "../utils/Tamplates/pdfFotmat";
 import { Request, Response, NextFunction } from "express";
import { transactionSearchSchema } from "../Schemas/transaction";
import { buildTransactionFilter } from "../helper/searchFilter";

import prisma from "../config/db";
import { CustomError } from "../utils/customError";
import puppeteer from "puppeteer";
import { sendTransactionPDFToEmail } from "../utils/verificationEmail";


export async function GenerateTransactionPDF(req: Request, res: Response, next: NextFunction) {
  const {id,name,email} = req.user ! ;

  if (!id ||!name ||!email) return next(new CustomError("User not authenticated", 401));

  const result = transactionSearchSchema.safeParse(req.query);
  if (!result.success) return next(new CustomError("Invalid search parameters", 400));

  try {
    const filters = result.data;
    const whereClause = buildTransactionFilter(id, filters);

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
    });

    const html = generateBankStatementHTML(transactions,{email:email,name});
 
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=transaction-statement.pdf");
    await sendTransactionPDFToEmail(Buffer.from(pdfBuffer), email,name);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
}
