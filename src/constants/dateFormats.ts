/** ISO date format (YYYY-MM-DD) used for API requests and backend communication */
export const API_DATE_FORMAT = "yyyy-MM-dd" as const;

/** Display format for dates in the UI */
export const DISPLAY_DATE_FORMAT = "do MMMM yyyy" as const;

/**
 * User-selectable date display formats (date-fns pattern strings). Used to
 * render bill dates according to the user's locale/country or an explicit
 * choice in Settings.
 */
export const DATE_FORMAT_OPTIONS = [
  "dd/MM/yyyy",
  "MM/dd/yyyy",
  "dd-MM-yyyy",
  "yyyy-MM-dd",
  "yyyy/MM/dd",
  "dd.MM.yyyy",
  "dd MMM yyyy",
  "MMM dd, yyyy",
  "dd MMMM yyyy",
  "MMMM dd, yyyy",
] as const;

export type DateFormatPattern = (typeof DATE_FORMAT_OPTIONS)[number];

/** Follow the device locale instead of pinning a pattern. */
export const DATE_FORMAT_AUTO = "auto" as const;

/**
 * What the user picked in Settings. `"auto"` is resolved to a concrete pattern
 * at read time, so anything that formats a date works with `DateFormatPattern`.
 */
export type DateFormatSetting = typeof DATE_FORMAT_AUTO | DateFormatPattern;

/**
 * Fallback used when no explicit choice, country, or device language can
 * determine a format. Matches the day-first, short-month styling the app has
 * always shipped, so it reads unambiguously in English.
 */
export const DEFAULT_DATE_FORMAT: DateFormatPattern = "dd MMM yyyy";

/**
 * Example rendering of each pattern, shown next to the option in Settings. The
 * sample date is the 17th so that day-first and month-first patterns read
 * differently from one another.
 */
export const DATE_FORMAT_EXAMPLES: Record<DateFormatPattern, string> = {
  "dd/MM/yyyy": "17/08/2026",
  "MM/dd/yyyy": "08/17/2026",
  "dd-MM-yyyy": "17-08-2026",
  "yyyy-MM-dd": "2026-08-17",
  "yyyy/MM/dd": "2026/08/17",
  "dd.MM.yyyy": "17.08.2026",
  "dd MMM yyyy": "17 Aug 2026",
  "MMM dd, yyyy": "Aug 17, 2026",
  "dd MMMM yyyy": "17 August 2026",
  "MMMM dd, yyyy": "August 17, 2026",
};
