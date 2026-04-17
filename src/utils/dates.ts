export type DateRange = {
  from?: Date;
  to?: Date;
};

export type Matcher = Date | Date[] | DateRange | { before: Date } | { after: Date } | { dayOfWeek: number[] } | ((date: Date) => boolean);

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(locale: string, options: Intl.DateTimeFormatOptions) {
  const key = `${locale}:${JSON.stringify(options)}`;
  const formatter = formatterCache.get(key);

  if (formatter) {
    return formatter;
  }

  const nextFormatter = new Intl.DateTimeFormat(locale, options);
  formatterCache.set(key, nextFormatter);
  return nextFormatter;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addDays(date: Date, amount: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

export function differenceInCalendarDays(left: Date, right: Date): number {
  const leftTime = startOfDay(left).getTime();
  const rightTime = startOfDay(right).getTime();
  return Math.round((leftTime - rightTime) / 86400000);
}

export function isSameDay(left?: Date, right?: Date): boolean {
  if (!left || !right) {
    return false;
  }

  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

export function formatIsoDateShort(date: Date, locale: string): string {
  const formatter = getFormatter(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const parts = formatter.formatToParts(date);
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  return `${day} ${month} ${year}`.trim();
}

export function formatMonthLong(date: Date, locale: string): string {
  return getFormatter(locale, { month: "long" }).format(date);
}

export function formatMonthYear(date: Date, locale: string): string {
  return getFormatter(locale, { month: "long", year: "numeric" }).format(date);
}

export function formatYearNumeric(date: Date, locale: string): string {
  return getFormatter(locale, { year: "numeric" }).format(date);
}

export function getWeekdayLabels(locale: string, isoWeek = true): string[] {
  const formatter = getFormatter(locale, { weekday: "short" });
  const sunday = new Date(2024, 0, 7);
  const labels = Array.from({ length: 7 }, (_, index) => formatter.format(addDays(sunday, index)));
  return isoWeek ? [...labels.slice(1), labels[0]] : labels;
}

export function getMonthDays(month: Date, isoWeek = true): Date[] {
  const firstOfMonth = startOfMonth(month);
  const startDay = firstOfMonth.getDay();
  const offset = isoWeek ? (startDay + 6) % 7 : startDay;
  const gridStart = addDays(firstOfMonth, -offset);

  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

function matchesSingle(date: Date, matcher: Matcher): boolean {
  if (typeof matcher === "function") {
    return matcher(date);
  }

  if (Array.isArray(matcher)) {
    return matcher.some((candidate) => isSameDay(date, candidate));
  }

  if (isDate(matcher)) {
    return isSameDay(date, matcher);
  }

  if ("before" in matcher) {
    return startOfDay(date) < startOfDay(matcher.before);
  }

  if ("after" in matcher) {
    return startOfDay(date) > startOfDay(matcher.after);
  }

  if ("dayOfWeek" in matcher) {
    return matcher.dayOfWeek.includes(date.getDay());
  }

  const from = matcher.from ? startOfDay(matcher.from) : undefined;
  const to = matcher.to ? startOfDay(matcher.to) : undefined;
  const current = startOfDay(date);

  if (from && to) {
    return current >= from && current <= to;
  }

  if (from) {
    return current >= from;
  }

  if (to) {
    return current <= to;
  }

  return false;
}

export function dateMatchModifiers(date: Date, matchers?: Matcher | Matcher[]): boolean {
  if (!matchers) {
    return false;
  }

  const matcherList = Array.isArray(matchers) ? matchers : [matchers];
  return matcherList.some((matcher) => matchesSingle(date, matcher));
}
