export function generateBankStatementHTML(
  transactions: any[],
  user: { name: string; email: string }
) {
  const openingBalance = 12000;  // dummy data 
  let runningBalance = openingBalance; // dummy data

  let totalIncome = 0;
  let totalExpense = 0;


  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const periodStart = sorted.length > 0 ? new Date(sorted[0].date).toLocaleDateString() : "-";
  const periodEnd = sorted.length > 0 ? new Date(sorted[sorted.length - 1].date).toLocaleDateString() : "-";

  const rows = transactions.map((t) => {
    const isIncome = t.type === "income";
    const amount = t.amount;
    const signedAmount = isIncome ? amount : -amount;
    runningBalance += signedAmount;
const dateTime = new Date(t.date).toLocaleString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

    if (isIncome) totalIncome += amount;
    else totalExpense += amount;

    return `
      <tr>
    <td>${dateTime}</td>
    <td>${t.note || '-'}</td>
    <td>${isIncome ? `₹${amount.toFixed(2)}` : ''}</td>
    <td>${!isIncome ? `-₹${amount.toFixed(2)}` : ''}</td>
    <td>${signedAmount < 0 ? `-₹${Math.abs(signedAmount).toFixed(2)}` : `₹${signedAmount.toFixed(2)}`}</td>
  </tr>
    `;
  }).join("");

  const netBalance = totalIncome - totalExpense;
  const closingBalance = openingBalance + netBalance;

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #333;
        }
        h1 {
          margin-bottom: 5px;
        }
        h2, h3 {
          text-align: center;
          margin-top: 30px;
          margin-bottom: 10px;
        }
        .header, .footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .company {
          text-align: right;
        }
        .summary-table, .transaction-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 14px;
        }
        .summary-table th,
        .summary-table td,
        .transaction-table th,
        .transaction-table td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        .summary-table th,
        .transaction-table th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .footer {
          font-size: 12px;
          margin-top: 50px;
          border-top: 1px solid #ccc;
          padding-top: 10px;
        }
        .totals {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>Account Statement</h1>
          <p><strong>ACCOUNT</strong><br>${user.name}<br>${user.email}</p>
          <p><strong>PERIOD</strong><br>${periodStart} – ${periodEnd}</p>
        </div>
        <div class="company">
          <h2>WalletGuardian</h2>
          <p>123 Secure Lane<br>India<br>support@walletguardian.com<br>+91 12345 67890</p>
        </div>
      </div>

      <h3>Summary</h3>
      <table class="summary-table">
        <thead>
          <tr>
            <th>PERIOD</th>
            <th>OPENING BALANCE</th>
            <th>CLOSING BALANCE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</td>
            <td>₹${openingBalance.toFixed(2)}</td>
            <td>₹${closingBalance.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <h3>Transactions</h3>
      <table class="transaction-table">
        <thead>
          <tr>
            <th>DATE</th>
            <th>DESCRIPTION</th>
            <th>INCOME</th>
            <th>EXPENSE</th>
            <th>NET CHANGE</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
        <tfoot>
          <tr class="totals">
            <td colspan="2">MONTHLY TOTALS</td>
            <td>₹${totalIncome.toFixed(2)}</td>
            <td>-₹${totalExpense.toFixed(2)}</td>
            <td>₹${netBalance.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div class="footer">
        <div>
          If you have found errors or have questions about your statement, please contact WalletGuardian at support@walletguardian.com or call +91 12345 67890.
        </div>
        <div style="text-align:right;">
          Page 1 of 1
        </div>
      </div>
    </body>
  </html>
  `;
}
