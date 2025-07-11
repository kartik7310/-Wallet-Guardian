export function buildTransactionFilter(userId:Number,filters:any){
  const { type, category, min, max, startDate, endDate, note } = filters;
  const where:any = {userId, deleted: false};
  if(type)where.type = type;
    if (category) where.category = category;
if (min || max) {
    where.amount = {};
    if (min) where.amount.gte = min;
    if (max) where.amount.lte = max;
  }
    if (startDate && endDate) {
    where.date = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }
   if (note) {
    where.note = {
      contains: note,
      mode: "insensitive",
    };
  }
   return where;
}