import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";
import { generateBankStatementHTML } from "../utils/Tamplates/pdfFotmat";
import { browserPromise } from "../utils/puppeteer";
import {CustomError} from "../utils/customError";
import { Category } from "../../generated/prisma";

export async function GenerateTransactionPDF(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id, name, email } = req.user!;
  if (!id || !name || !email)
    return next(new CustomError("User not authenticated", 401));
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: id,
      },
      orderBy: { date: "desc" },
    });

    const cleaned = transactions.map((t) => ({
      date: t.date,
      note: t.note ?? undefined,
      type: t.type,
      amount: t.amount,
      category: t.category as Category, // Ensure category is a string
    }));

    const html = generateBankStatementHTML(cleaned, { email, name });

    const browser = await browserPromise;
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await page.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transaction-statement.pdf"
    );
    return res.end(pdfBuffer);
  } catch (err) {
    return next(err);
  }
}
