import prisma from "../config/db";
import { browserPromise } from "../utils/puppeteer";
import { generateBankStatementHTML } from "../utils/Tamplates/pdfFotmat";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { aggregate } from "../helper/aggregation";
import { Category } from "@prisma/client";

function mdToHtml(md: string) {
  return md
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- /gm, "• ")
    .replace(/\n/g, "<br>");
}


export async function buildMonthlyStatementPdf(
  userId: number,
  name: string,
  email: string
) {
  const txns = await prisma.transaction.findMany({
    where: {
      AND: [{ userId }, { deleted: false }],
    },
    orderBy: { date: "desc" },
  });

  if (!txns.length) throw new Error("No transactions");

  const { income, expense, byCat, top } = aggregate(txns);

  /* budgets */
  const budgets = await prisma.budget.findMany({ where: { userId } });
  const budgetMap: Record<string, { planned: number; spent: number }> = {};
  budgets.forEach(
    (b:any) =>
      (budgetMap[b.category] = {
        planned: b.plannedAmount,
        spent: b.spentAmount,
      })
  );

  /* build AI summary */
  const prompt = `
You are a friendly financial assistant. The user tracks planned vs spent amounts across categories.

Please analyze this data and format your response exactly like this:

Summary Highlights:
• Category A: Over/Under budget (Planned ₹X, Spent ₹Y)
• Category B: ...

Overall Savings: ₹Z (Total Income ₹X, Total Expenses ₹Y)

Insights:
1. ...
2. ...

Tip: ...

Here's the data:
- Income: ₹${income}
- Expenses: ₹${expense}
- Top Category: ${top?.[0]} (₹${top?.[1]})

Budget Breakdown:
${Object.entries(budgetMap)
  .map(
    ([cat, { planned, spent }]) =>
      `- ${cat}: Planned ₹${planned}, Spent ₹${spent}`
  )
  .join("\n")}

Keep the tone concise and helpful.
`;

  const model = new ChatOpenAI({
    modelName: "mistralai/mistral-7b-instruct",
    temperature: 0.5,
    openAIApiKey: process.env.OPENROUTER_API_KEY!,
    configuration: { baseURL: "https://openrouter.ai/api/v1" },
  });

  const raw = await model.invoke([new HumanMessage(prompt)]);
  const aiSummary = mdToHtml([raw.content].join("\n\n").trim());

  /* build HTML → PDF */
  const cleaned = txns.map((t:any) => ({
    date: t.date,
    note: t.note ?? undefined,
    type: t.type,
    amount: t.amount,
    category: t.category as Category,
  }));

  const html = generateBankStatementHTML(cleaned, {
    name,
    email,
    aiSummary,
  });

  const browser = await browserPromise;
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const buffer = await page.pdf({ format: "A4", printBackground: true });
  await page.close();

  return { buffer, user: { name, email } };
}
