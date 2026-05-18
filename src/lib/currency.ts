import type { DecimalFormat } from "@/components/context/preferences/PreferencesContext";

export type { FiatCurrencyCode } from "@/constants/currencies";
export { FIAT_CURRENCY_CODES, FIAT_CURRENCY_CODES_SET } from "@/constants/currencies";

import { FIAT_CURRENCY_CODES_SET } from "@/constants/currencies";
import type { FiatCurrencyCode } from "@/constants/currencies";

export type CryptoCurrencyCode = "btc" | "sat";
export type CurrencyCode = FiatCurrencyCode | CryptoCurrencyCode;

export const SUPPORTED_CURRENCY_CODES = new Set<CurrencyCode>([...FIAT_CURRENCY_CODES_SET, "btc", "sat"]);

export function isCurrencyCode(code: string): code is CurrencyCode {
  return SUPPORTED_CURRENCY_CODES.has(code.toLowerCase() as CurrencyCode);
}

/**
 * Map of lowercase FiatCurrencyCode → units of that currency per 1 BTC,
 * as returned by the Coinbase exchange-rates API.
 *
 * - Keys are always lowercase FiatCurrencyCode values (enforced by useRates).
 * - Not all codes are guaranteed to be present — Coinbase may omit some.
 *   Conversion helpers throw when a required rate is missing.
 */
export type Rates = Partial<Record<FiatCurrencyCode, number>>;

export const SATS_PER_BTC = 100_000_000 as const;

/**
 * Get the appropriate locale string based on decimal format preference.
 * - point: 1.000,00 (German/European style — uses de-DE)
 * - comma: 1,000.00 (US/UK style — uses en-US)
 * - space: 1 000,00 (French/International style — uses fr-FR)
 */
export function getLocaleForFormat(baseLocale: string, format: DecimalFormat): string {
  switch (format) {
    case "point":
      return "de-DE";
    case "comma":
      return "en-US";
    case "space":
      return "fr-FR";
    default:
      return baseLocale;
  }
}

export function getEurPerBtc(rates: Rates): number {
  return rates.eur ?? 0;
}

export function satToBtc(sat: number): number {
  return sat / SATS_PER_BTC;
}

export function btcToSat(btc: number): number {
  return Math.round(btc * SATS_PER_BTC);
}

function btcToFiat(btc: number, currency: FiatCurrencyCode, rates: Rates): number {
  const rate = rates[currency];
  if (rate === undefined || !isFinite(rate) || rate <= 0) {
    throw new Error(`No rate available for currency: ${currency}`);
  }
  return btc * rate;
}

function fiatToBtc(amount: number, currency: FiatCurrencyCode, rates: Rates): number {
  const rate = rates[currency];
  if (rate === undefined || !isFinite(rate) || rate <= 0) {
    throw new Error(`No rate available for currency: ${currency}`);
  }
  return amount / rate;
}

/** Convert a source currency amount to satoshis. */
export function convertToSat(amount: number, source: CurrencyCode, rates: Rates): number {
  if (source === "sat") return Math.round(amount);
  if (source === "btc") return btcToSat(amount);
  return btcToSat(fiatToBtc(amount, source, rates));
}

/** Convert from satoshis to a target currency. */
export function convertFromSat(sat: number, target: CurrencyCode, rates: Rates): number {
  if (target === "sat") return Math.round(sat);
  const btc = satToBtc(sat);
  if (target === "btc") return btc;
  return btcToFiat(btc, target, rates);
}

/** Fully generic converter: any CurrencyCode → any CurrencyCode. */
export function convert(amount: number, source: CurrencyCode, target: CurrencyCode, rates: Rates): number {
  if (source === target) return amount;
  return convertFromSat(convertToSat(amount, source, rates), target, rates);
}

/**
 * Format an amount for display including the currency symbol/code.
 * Returns a plain string suitable for aria-labels or plain-text contexts.
 */
export function formatAmount(value: number, currency: CurrencyCode, locale = "en-US"): string {
  if (currency === "sat") {
    return `${new Intl.NumberFormat(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)} sat`;
  }
  if (currency === "btc") {
    return `${new Intl.NumberFormat(locale, { minimumFractionDigits: 8, maximumFractionDigits: 8 }).format(value)} BTC`;
  }
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)} ${currency.toUpperCase()}`;
  }
}

/**
 * Format an absolute amount as a plain number string (no symbol).
 * Handles the <0.01 edge case for fiat currencies.
 * Used for split-symbol rendering in the Currency component.
 */
export function formatAmountNumber(abs: number, currency: CurrencyCode, locale: string): string {
  if (currency === "sat") {
    return new Intl.NumberFormat(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(abs);
  }
  if (currency === "btc") {
    return new Intl.NumberFormat(locale, { minimumFractionDigits: 8, maximumFractionDigits: 8 }).format(abs);
  }
  if (abs > 0 && abs < 0.005) {
    const cents = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(0.01);
    return `<${cents}`;
  }
  return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(abs);
}
