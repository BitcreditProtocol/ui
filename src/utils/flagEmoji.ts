/**
 * Flags in the designs are native emoji rather than image assets, so that they
 * pick up the platform's own artwork. Everything that renders a flag goes
 * through here.
 */

const REGIONAL_INDICATOR_OFFSET = 0x1f1e6 - "A".charCodeAt(0);

const REGION_CODE = /^[A-Z]{2}$/;

/** Converts an ISO 3166-1 alpha-2 region code into its flag emoji. */
export function toFlagEmoji(regionCode: string | undefined | null): string | undefined {
  const region = regionCode?.toUpperCase() ?? "";

  if (!REGION_CODE.test(region)) {
    return undefined;
  }

  return String.fromCodePoint(...Array.from(region, (char) => char.charCodeAt(0) + REGIONAL_INDICATOR_OFFSET));
}

/** Flag for a BCP 47 locale, taken from its region subtag (e.g. "de-DE" -> 🇩🇪). */
export function getLocaleFlagEmoji(locale: string | undefined | null): string | undefined {
  return toFlagEmoji(locale?.split(/[-_]/)[1]);
}

/**
 * Currency codes normally start with the issuing region's code, but
 * supranational units and precious metals have no flag at all, and "AN" was
 * retired from ISO 3166-1 so the Antillean guilder falls back to the
 * Netherlands.
 */
const CURRENCY_REGION_OVERRIDES: Record<string, string | null> = {
  ang: "NL",
  xaf: null,
  xag: null,
  xau: null,
  xcd: null,
  xdr: null,
  xof: null,
  xpd: null,
  xpf: null,
  xpt: null,
};

/** Flag for a fiat currency code, or `undefined` when the currency has no country. */
export function getCurrencyFlagEmoji(currencyCode: string): string | undefined {
  const code = currencyCode.toLowerCase();
  const region = code in CURRENCY_REGION_OVERRIDES ? CURRENCY_REGION_OVERRIDES[code] : code.slice(0, 2);

  return region ? toFlagEmoji(region) : undefined;
}
