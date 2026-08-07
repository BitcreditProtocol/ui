import { COUNTRIES, type CountryCode } from "./countries";
import { DATE_FORMAT_OPTIONS, type DateFormatPattern, DEFAULT_DATE_FORMAT } from "./dateFormats";

export const DEFAULT_DATE_FORMAT_PATTERN = DEFAULT_DATE_FORMAT;

export const COUNTRY_DATE_FORMATS: Partial<Record<CountryCode, DateFormatPattern>> = {
  AT: "dd.MM.yyyy",
  CA: "yyyy-MM-dd",
  CH: "dd.MM.yyyy",
  CN: "yyyy-MM-dd",
  DE: "dd.MM.yyyy",
  HU: "yyyy-MM-dd",
  JP: "yyyy-MM-dd",
  KR: "yyyy-MM-dd",
  PL: "dd.MM.yyyy",
  RU: "dd.MM.yyyy",
  SE: "yyyy-MM-dd",
  US: "MM/dd/yyyy",
};

export const DEFAULT_COUNTRY_DATE_FORMAT_PATTERN: DateFormatPattern = "dd/MM/yyyy";

export function isDateFormatPattern(value: unknown): value is DateFormatPattern {
  return typeof value === "string" && DATE_FORMAT_OPTIONS.includes(value as DateFormatPattern);
}

export function normalizeCountryCode(value: string | undefined | null): CountryCode | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().toUpperCase();
  return normalized in COUNTRIES ? (normalized as CountryCode) : undefined;
}

export function getDateFormatPatternForCountry(countryCode: string | undefined | null): DateFormatPattern | undefined {
  const normalized = normalizeCountryCode(countryCode);

  if (!normalized) {
    return undefined;
  }

  return COUNTRY_DATE_FORMATS[normalized] ?? DEFAULT_COUNTRY_DATE_FORMAT_PATTERN;
}
