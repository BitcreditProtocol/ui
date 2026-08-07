import { useContext, useMemo } from "react";

import { useLanguage } from "@/components/context/language/LanguageContext";
import { PreferencesContext } from "@/components/context/preferences/PreferencesContext";
import type { DateFormatPattern } from "@/constants/dateFormats";

function getUtcDateParts(date: Date, locale: string) {
  const shortParts = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(date);
  const numericParts = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(date);
  const longParts = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(date);
  const day = shortParts.find((part) => part.type === "day")?.value ?? "";
  const month = shortParts.find((part) => part.type === "month")?.value ?? "";
  const longMonth = longParts.find((part) => part.type === "month")?.value ?? "";
  const numericMonth = numericParts.find((part) => part.type === "month")?.value ?? "";
  const year = shortParts.find((part) => part.type === "year")?.value ?? "";

  return { day, longMonth, month, numericMonth, year };
}

function formatUtcDate(date: Date, locale: string, pattern?: DateFormatPattern): string {
  const { day, longMonth, month, numericMonth, year } = getUtcDateParts(date, locale);

  if (!pattern || pattern === "dd MMM yyyy") {
    return `${day} ${month} ${year}`;
  }

  switch (pattern) {
    case "dd/MM/yyyy":
      return `${day}/${numericMonth}/${year}`;
    case "MM/dd/yyyy":
      return `${numericMonth}/${day}/${year}`;
    case "dd-MM-yyyy":
      return `${day}-${numericMonth}-${year}`;
    case "yyyy-MM-dd":
      return `${year}-${numericMonth}-${day}`;
    case "yyyy/MM/dd":
      return `${year}/${numericMonth}/${day}`;
    case "dd.MM.yyyy":
      return `${day}.${numericMonth}.${year}`;
    case "MMM dd, yyyy":
      return `${month} ${day}, ${year}`;
    case "dd MMMM yyyy":
      return `${day} ${longMonth} ${year}`;
    case "MMMM dd, yyyy":
      return `${longMonth} ${day}, ${year}`;
  }
}

function formatUtcTime(date: Date, locale: string): string {
  const parts = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).formatToParts(date);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "";

  return `${hour}:${minute}`;
}

/**
 * Hook for formatting dates in UTC timezone.
 * Backend stores timestamps in UTC, and we display them in UTC.
 */
export function useFormatDate() {
  const { locale } = useLanguage();
  const preferences = useContext(PreferencesContext);
  const dateFormat = preferences?.dateFormat;

  return useMemo(
    () => ({
      /**
       * Formats a Unix timestamp (in seconds) to a localized date string in UTC.
       * @param seconds - Unix timestamp in seconds
       * @returns Formatted date string in UTC (e.g., "16 Dec 2025")
       */
      formatFromSeconds: (seconds: number): string => {
        const date = new Date(seconds * 1000);
        try {
          return formatUtcDate(date, locale, dateFormat);
        } catch {
          return date.toUTCString();
        }
      },

      /**
       * Formats a Unix timestamp (in seconds) to a localized date and time string in UTC.
       * @param seconds - Unix timestamp in seconds
       * @returns Formatted date and time string in UTC (e.g., "16 Dec 2025, 14:30")
       */
      formatFromSecondsWithTime: (seconds: number): string => {
        const date = new Date(seconds * 1000);
        try {
          return `${formatUtcDate(date, locale, dateFormat)}, ${formatUtcTime(date, locale)}`;
        } catch {
          return date.toUTCString();
        }
      },

      /**
       * Formats a Date object or Unix timestamp (in milliseconds) to a localized date string in UTC.
       * @param date - Date object or Unix timestamp in milliseconds
       * @returns Formatted date string in UTC (e.g., "16 Dec 2025")
       */
      formatDate: (date: Date | number): string => {
        const dateObj = typeof date === "number" ? new Date(date) : date;
        try {
          return formatUtcDate(dateObj, locale, dateFormat);
        } catch {
          return dateObj.toUTCString();
        }
      },

      /**
       * Formats a Date object or Unix timestamp (in milliseconds) to a localized date and time string in UTC.
       * @param date - Date object or Unix timestamp in milliseconds
       * @returns Formatted date and time string in UTC (e.g., "16 Dec 2025, 14:30")
       */
      formatDateWithTime: (date: Date | number): string => {
        const dateObj = typeof date === "number" ? new Date(date) : date;
        try {
          return `${formatUtcDate(dateObj, locale, dateFormat)}, ${formatUtcTime(dateObj, locale)}`;
        } catch {
          return dateObj.toUTCString();
        }
      },
    }),
    [dateFormat, locale]
  );
}
