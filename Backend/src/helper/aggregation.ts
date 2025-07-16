
export function aggregate(txns: any[]) {
  let income = 0,
    expense = 0;
  const byCat: Record<string, number> = {};
  for (const t of txns) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
    byCat[t.category || "Uncategorized"] =
      (byCat[t.category || "Uncategorized"] || 0) + t.amount;
  }
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  return { income, expense, byCat, top };
}
