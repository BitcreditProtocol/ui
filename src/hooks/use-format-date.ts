import { useMemo } from "react";

import { useLanguage } from "@/components/context/language/LanguageContext";

/**
 * Hook for formatting dates in UTC timezone.
 * Backend stores timestamps in UTC, and we display them in UTC.
 */
export function useFormatDate() {
  const { locale } = useLanguage();

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
          const parts = new Intl.DateTimeFormat(locale, {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          }).formatToParts(date);
          const day = parts.find((p) => p.type === "day")?.value ?? "";
          const month = parts.find((p) => p.type === "month")?.value ?? "";
          const year = parts.find((p) => p.type === "year")?.value ?? "";
          return `${day} ${month} ${year}`;
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
          const parts = new Intl.DateTimeFormat(locale, {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          }).formatToParts(date);
          const day = parts.find((p) => p.type === "day")?.value ?? "";
          const month = parts.find((p) => p.type === "month")?.value ?? "";
          const year = parts.find((p) => p.type === "year")?.value ?? "";
          const hour = parts.find((p) => p.type === "hour")?.value ?? "";
          const minute = parts.find((p) => p.type === "minute")?.value ?? "";
          return `${day} ${month} ${year}, ${hour}:${minute}`;
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
          const parts = new Intl.DateTimeFormat(locale, {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          }).formatToParts(dateObj);
          const day = parts.find((p) => p.type === "day")?.value ?? "";
          const month = parts.find((p) => p.type === "month")?.value ?? "";
          const year = parts.find((p) => p.type === "year")?.value ?? "";
          return `${day} ${month} ${year}`;
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
          const parts = new Intl.DateTimeFormat(locale, {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          }).formatToParts(dateObj);
          const day = parts.find((p) => p.type === "day")?.value ?? "";
          const month = parts.find((p) => p.type === "month")?.value ?? "";
          const year = parts.find((p) => p.type === "year")?.value ?? "";
          const hour = parts.find((p) => p.type === "hour")?.value ?? "";
          const minute = parts.find((p) => p.type === "minute")?.value ?? "";
          return `${day} ${month} ${year}, ${hour}:${minute}`;
        } catch {
          return dateObj.toUTCString();
        }
      },
    }),
    [locale]
  );
}
