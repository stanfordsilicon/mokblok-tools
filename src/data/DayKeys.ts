// To avoid confusion if 0 should mean Sunday or Monday, CLDR uses string keys for days of the week
export const DayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function getDaysOfWeekOrdered(firstDayOfWeek: 'sun' | 'mon'): string[] {
  if (firstDayOfWeek === 'mon') return [...DayKeys.slice(1), DayKeys[0]];
  return DayKeys;
}

export function getDateDayOfWeekKey(date: Date): string {
  return DayKeys[date.getDay()];
}
