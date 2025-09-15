export const sameDay = (a: Date, b: Date) =>
  a.getUTCFullYear() === b.getUTCFullYear() &&
  a.getUTCMonth() === b.getUTCMonth() &&
  a.getUTCDate() === b.getUTCDate();

export const generateNextDates = (
  lastDate: Date,
  value: number,
  unit: string,
  count: number,
): Date[] => {
  const dates: Date[] = [];
  const current = new Date(lastDate);

  for (let i = 0; i < count; i++) {
    switch (unit) {
      case 'day':
        current.setUTCDate(current.getUTCDate() + value);
        break;
      case 'week':
        current.setUTCDate(current.getUTCDate() + value * 7);
        break;
      case 'month':
        current.setUTCMonth(current.getUTCMonth() + value);
        break;
      case 'year':
        current.setUTCFullYear(current.getUTCFullYear() + value);
        break;
    }
    const newDate = new Date(current);
    newDate.setUTCHours(0, 0, 0, 0);
    dates.push(newDate);
  }

  return dates;
};
