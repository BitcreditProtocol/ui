import { DEFAULT_DATE_FORMAT_PATTERN, getDateFormatPatternForCountry, isDateFormatPattern } from "@/constants/dateFormatPatterns";
import type { DateFormatPattern } from "@/constants/dateFormats";

type ResolveDateFormatPatternOptions = {
  explicitPattern?: DateFormatPattern | null;
  countryCode?: string | null;
  locale?: string | null;
};

function getBrowserLocale(): string | undefined {
  if (typeof navigator === "undefined") {
    return undefined;
  }

  return navigator.language || navigator.languages?.[0];
}

function getLocalePartOrder(locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
      .formatToParts(new Date(Date.UTC(2026, 7, 6)))
      .filter((part) => part.type === "day" || part.type === "month" || part.type === "year")
      .map((part) => part.type)
      .join("-");
  } catch {
    return "";
  }
}

export function detectDateFormatPatternFromLocale(locale: string | undefined | null): DateFormatPattern | undefined {
  const order = getLocalePartOrder(locale || getBrowserLocale() || "");

  if (order === "month-day-year") {
    return "MM/dd/yyyy";
  }

  if (order === "year-month-day") {
    return "yyyy-MM-dd";
  }

  if (order === "day-month-year") {
    return "dd/MM/yyyy";
  }

  return undefined;
}

export function resolveDateFormatPattern({
  countryCode,
  explicitPattern,
  locale,
}: ResolveDateFormatPatternOptions = {}): DateFormatPattern {
  if (isDateFormatPattern(explicitPattern)) {
    return explicitPattern;
  }

  const countryPattern = getDateFormatPatternForCountry(countryCode);
  if (countryPattern) {
    return countryPattern;
  }

  return detectDateFormatPatternFromLocale(locale) ?? DEFAULT_DATE_FORMAT_PATTERN;
}
