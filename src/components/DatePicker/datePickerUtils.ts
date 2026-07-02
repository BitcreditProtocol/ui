import { type DateRange, formatIsoDateShort, isSameDay } from "@/utils/dates";
import type { TimeFormat } from "./types";

export const isSameOrBothMissing = (a?: Date, b?: Date) => {
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return isSameDay(a, b);
};

export const isSameRange = (a?: DateRange, b?: DateRange) => isSameOrBothMissing(a?.from, b?.from) && isSameOrBothMissing(a?.to, b?.to);

export const cloneDate = (date?: Date) => (date ? new Date(date) : undefined);

export const cloneRange = (range?: DateRange): DateRange => ({
  from: cloneDate(range?.from),
  to: cloneDate(range?.to),
});

export const formatDisplayDate = (date: Date | undefined, locale: string) => (date ? formatIsoDateShort(date, locale) : "");

export const getTimeString = (date?: Date, format: TimeFormat = "24h") => {
  if (!date) return "";
  const h = date.getHours();
  const m = date.getMinutes();
  if (format === "24h") {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
};

export const applyTimeToDate = (date: Date, timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);
  return next;
};

export const formatDisplayDateTime = (date: Date | undefined, locale: string, timeFormat: TimeFormat = "24h") =>
  date ? `${formatIsoDateShort(date, locale)}, ${getTimeString(date, timeFormat)}` : "";
