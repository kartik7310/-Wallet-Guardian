import dayjs from "dayjs";

interface UserInfo {
  name: string;
  email: string;
  aiSummary?: string;
}

interface Txn {
  date: string | Date;
  note?: string;
  type: "income" | "expense";
  amount: number;
  category?: string;
}

export function generateBankStatementHTML(transactions: Txn[], user: UserInfo) {
  let totalIncome = 0;
  let totalExpense = 0;

  const sorted = [...transactions].sort(
    (a, b) => +new Date(a.date) - +new Date(b.date),
  );

  const periodStart = sorted.length
    ? dayjs(sorted[0].date).format("DD MMM YYYY")
    : "-";
  const periodEnd = sorted.length
    ? dayjs(sorted[sorted.length - 1].date).format("DD MMM YYYY")
    : "-";

  const rupees = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });

  const rowsHtml = sorted
    .map((t) => {
      const isIncome = t.type === "income";
      const formattedDate = dayjs(t.date).format("DD‑MMM‑YYYY hh:mm A");

      if (isIncome) totalIncome += t.amount;
      else totalExpense += t.amount;

      return `
        <tr>
          <td>${formattedDate}</td>
          <td>${t.category || "-"}</td>
          <td>${t.note || (isIncome ? "Income credited" : "Expense debited")}</td>
          <td style="text-align:right;">${isIncome ? rupees.format(t.amount) : ""}</td>
          <td style="text-align:right;">${!isIncome ? rupees.format(t.amount) : ""}</td>
        </tr>`;
    })
    .join("");

  const monthLabel = dayjs().format("MMMM YYYY");

  return /*html*/ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Wallet Guardian – Account Statement</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 40px;
      color: #333;
      background: #f4f6f8;
    }
    h1, h2, h3 {
      margin: 0 0 10px;
    }
    p {
      margin: 5px 0;
    }
    .container {
      background: #fff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    }
    .header, .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 30px;
      font-size: 14px;
    }
    .table th, .table td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    .table th {
      background: #f0f0f0;
    }
    .totals td {
      font-weight: bold;
      background: #fafafa;
    }
    .summary {
      border: 1px solid #ddd;
      background: #f9f9f9;
      padding: 15px;
      margin-top: 40px;
      border-radius: 8px;
      width: 100%;
      font-size: 14px;
    }
    .summary h3 {
      margin-bottom: 10px;
      color: #333;
    }
    .footer {
      font-size: 12px;
      margin-top: 40px;
      border-top: 1px solid #ccc;
      padding-top: 10px;
    }
    .footer span:last-child {
      text-align: right;
      flex: 1;
    }
    .brand {
      text-align: right;
      font-weight: bold;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1>Account Statement</h1>
        <p><strong>Account Holder</strong><br>${user.name}<br>${user.email}</p>
        <p><strong>Statement Period</strong><br>${periodStart} – ${periodEnd}</p>
      </div>
      <div class="brand">
        <h2>Wallet Guardian</h2>
        <p>123 Secure Lane<br>India<br>support@WalletGuardian.com<br>+91 12345 67890</p>
      </div>
    </div>

    <h3 style="text-align:center; margin-top:30px;">${monthLabel}</h3>

    <table class="table">
      <thead>
        <tr>
          <th>DATE</th>
          <th>CATEGORY</th>
          <th>DESCRIPTION</th>
          <th>INCOME</th>
          <th>EXPENSE</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
      <tfoot>
        <tr class="totals">
          <td colspan="3">MONTHLY TOTALS</td>
          <td style="text-align:right;">${rupees.format(totalIncome)}</td>
          <td style="text-align:right;">${rupees.format(totalExpense)}</td>
        </tr>
      </tfoot>
    </table>

    <div class="summary">
      <h3> Summary</h3>
      ${user.aiSummary || "<em>No summary generated.</em>"}
    </div>

    <div class="footer">
      <span>If you notice inaccuracies, contact support@WalletGuardian.com or call +91 12345 67890.</span>
      <span>Page 1 of 1</span>
    </div>
  </div>
</body>
</html>
`;
}
