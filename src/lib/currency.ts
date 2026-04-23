import type { DecimalFormat } from "@/components/context/preferences/PreferencesContext";

export type FiatCurrencyCode = "usd" | "eur";
export type CryptoCurrencyCode = "btc" | "sat";
export type CurrencyCode = FiatCurrencyCode | CryptoCurrencyCode;

export type Rates = {
  usdPerBtc: number;
  eurPerUsd: number;
};

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

/** Derived rate: how many EUR one BTC is worth. */
export function getEurPerBtc(rates: Rates): number {
  return rates.usdPerBtc * rates.eurPerUsd;
}

export function satToBtc(sat: number): number {
  return sat / SATS_PER_BTC;
}

export function btcToSat(btc: number): number {
  return Math.round(btc * SATS_PER_BTC);
}

function btcToFiat(btc: number, currency: FiatCurrencyCode, rates: Rates): number {
  switch (currency) {
    case "usd":
      return btc * rates.usdPerBtc;
    case "eur":
      return btc * getEurPerBtc(rates);
    default: {
      const _exhaustive: never = currency;
      throw new Error(`Unsupported fiat currency: ${String(_exhaustive)}`);
    }
  }
}

function fiatToBtc(amount: number, currency: FiatCurrencyCode, rates: Rates): number {
  switch (currency) {
    case "usd":
      return amount / rates.usdPerBtc;
    case "eur":
      return amount / getEurPerBtc(rates);
    default: {
      const _exhaustive: never = currency;
      throw new Error(`Unsupported fiat currency: ${String(_exhaustive)}`);
    }
  }
}

/** Convert a source currency amount to satoshis. */
export function convertToSat(amount: number, source: CurrencyCode, rates: Rates): number {
  switch (source) {
    case "sat":
      return Math.round(amount);
    case "btc":
      return btcToSat(amount);
    case "usd":
    case "eur": {
      const btc = fiatToBtc(amount, source, rates);
      return btcToSat(btc);
    }
    default: {
      const _exhaustive: never = source;
      throw new Error(`Unsupported currency: ${String(_exhaustive)}`);
    }
  }
}

/** Convert from satoshis to a target currency. */
export function convertFromSat(sat: number, target: CurrencyCode, rates: Rates): number {
  const btc = satToBtc(sat);

  switch (target) {
    case "sat":
      return Math.round(sat);
    case "btc":
      return btc;
    case "usd":
      return btc * rates.usdPerBtc;
    case "eur":
      return btcToFiat(btc, target, rates);
    default: {
      const _exhaustive: never = target;
      throw new Error(`Unsupported currency: ${String(_exhaustive)}`);
    }
  }
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
  switch (currency) {
    case "usd":
    case "eur":
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    case "btc":
      return `${new Intl.NumberFormat(locale, { minimumFractionDigits: 8, maximumFractionDigits: 8 }).format(value)} BTC`;
    case "sat":
      return `${new Intl.NumberFormat(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)} sat`;
    default: {
      const _exhaustive: never = currency;
      throw new Error(`Unsupported currency: ${String(_exhaustive)}`);
    }
  }
}

/**
 * Format an absolute amount as a plain number string (no symbol).
 * Handles the <0.01 edge case for fiat currencies.
 * Used for split-symbol rendering in the Currency component.
 */
export function formatAmountNumber(abs: number, currency: CurrencyCode, locale: string): string {
  switch (currency) {
    case "sat":
      return new Intl.NumberFormat(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(abs);
    case "btc":
      return new Intl.NumberFormat(locale, { minimumFractionDigits: 8, maximumFractionDigits: 8 }).format(abs);
    default: {
      if (abs > 0 && abs < 0.005) {
        const cents = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(0.01);
        return `<${cents}`;
      }
      return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(abs);
    }
  }
}
