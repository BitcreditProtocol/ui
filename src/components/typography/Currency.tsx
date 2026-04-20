import React, { useMemo } from "react";
import { type FormatNumberOptions, useIntl } from "react-intl";

import { usePreferences } from "@/components/context/preferences/PreferencesContext";
import { cn } from "@/lib/utils";

export type FormattedCurrencyProps = {
  value: number;
  className?: string;
  color?: "auto" | "none";
  type?: "auto" | "credit" | "debit";
  currency?: FormatNumberOptions["currency"];
  currencyDisplay?: FormatNumberOptions["currencyDisplay"] | "none";
} & Pick<FormatNumberOptions, "signDisplay">;

type CurrencyCode = "usd" | "eur" | "btc" | "sat";

const getLocaleForFormat = (locale: string, decimalFormat: "point" | "comma" | "space") => {
  if (decimalFormat === "point") {
    return locale.startsWith("de") || locale.startsWith("es") || locale.startsWith("it") || locale.startsWith("tr") ? "de-DE" : locale;
  }

  if (decimalFormat === "space") {
    return "fr-FR";
  }

  return locale;
};

// Helper: apply sign wrapping around a string or JSX content
const withSign = (content: React.ReactNode, amount: number, signDisplay: FormattedCurrencyProps["signDisplay"]): React.ReactNode => {
  if (signDisplay === "never") {
    return content;
  }
  if (amount < 0 || signDisplay === "negative") {
    return (
      <>
        {"-"}
        {content}
      </>
    );
  }
  if (amount > 0 || signDisplay === "always") {
    return (
      <>
        {"+"}
        {content}
      </>
    );
  }
  return content;
};

// Helper: plain number formatting with configurable fraction digits
const formatPlain = (locale: string, abs: number, minFrac = 2, maxFrac = 2): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: minFrac,
    maximumFractionDigits: maxFrac,
  }).format(abs);
};

// Helper: fiat formatting (USD/EUR) with Intl currency style
const formatFiat = (
  locale: string,
  abs: number,
  code: "usd" | "eur",
  currencyDisplay: Exclude<FormattedCurrencyProps["currencyDisplay"], "none">
): string => {
  const currencyCode = code.toUpperCase();

  if (abs > 0 && abs < 0.005) {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      currencyDisplay,
    });
    const zeroOneFormatted = formatter.format(0.01);
    return zeroOneFormatted.replace("0.01", "<0.01").replace("0,01", "<0,01");
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currencyDisplay,
  }).format(abs);
};

// Helper: BTC formatting returning JSX with "BTC" text at the end
const formatBtc = (locale: string, abs: number, currencyDisplay: FormattedCurrencyProps["currencyDisplay"]): React.ReactNode => {
  const number = formatPlain(locale, abs, 8, 8);
  const symbolSpan = (text: string) => (
    <span className="text-text-200 text-xs font-normal leading-normal" aria-hidden>
      {text}
    </span>
  );

  if (currencyDisplay === "none") {
    return number;
  }

  return (
    <>
      {number} {symbolSpan("BTC")}
    </>
  );
};

// Helper: SAT formatting returning JSX with zero fraction digits and \"sat\" tag
const formatSat = (locale: string, abs: number, currencyDisplay: FormattedCurrencyProps["currencyDisplay"]): React.ReactNode => {
  const number = formatPlain(locale, abs, 0, 0);
  if (currencyDisplay === "none") {
    return number;
  }
  return (
    <>
      {number}{" "}
      <span className="text-text-200 text-xs font-normal leading-normal" aria-hidden>
        sat
      </span>
    </>
  );
};

const Currency = ({
  value,
  className,
  color = "auto",
  type = "auto",
  currency,
  currencyDisplay = "symbol",
  signDisplay = "exceptZero",
}: FormattedCurrencyProps) => {
  const { currency: selected, decimalFormat } = usePreferences();
  const intl = useIntl();
  const locale = getLocaleForFormat(intl.locale, decimalFormat);

  const derived = useMemo(() => {
    if (currency) {
      return {
        amount: value,
        code: currency.toLowerCase() as CurrencyCode,
      } as const;
    }

    return { amount: value, code: selected as CurrencyCode } as const;
  }, [value, currency, selected]);

  const formattedValue = useMemo(() => {
    const hasExplicitCurrency = Boolean(currency);

    if (!hasExplicitCurrency && currencyDisplay === "none") {
      const abs = Math.abs(value);
      const base = formatPlain(locale, abs, 2, 8);
      return withSign(base, value, signDisplay);
    }

    if (!hasExplicitCurrency && currencyDisplay !== "none") {
      const selectedCode = derived.code;
      const abs = Math.abs(derived.amount);

      if (selectedCode === "usd" || selectedCode === "eur") {
        const formatted = formatFiat(locale, abs, selectedCode, currencyDisplay);
        return withSign(formatted, derived.amount, signDisplay);
      }

      if (selectedCode === "btc") {
        const content = formatBtc(locale, abs, currencyDisplay);
        return withSign(content, derived.amount, signDisplay);
      }

      if (selectedCode === "sat") {
        const content = formatSat(locale, abs, currencyDisplay);
        return withSign(content, derived.amount, signDisplay);
      }

      const base = formatPlain(locale, abs, 2, 2);
      return withSign(base, derived.amount, signDisplay);
    }

    const code = (currency as string).toLowerCase();
    const abs = Math.abs(value);

    if (currencyDisplay === "none") {
      if (code === "sat") {
        const base = formatPlain(locale, abs, 0, 0);
        return withSign(base, value, signDisplay);
      }
      const base = formatPlain(locale, abs, 2, 2);
      return withSign(base, value, signDisplay);
    }

    if (code === "usd" || code === "eur") {
      const formatted = formatFiat(locale, abs, code, currencyDisplay);
      return withSign(formatted, value, signDisplay);
    }

    if (code === "btc") {
      const content = formatBtc(locale, abs, currencyDisplay);
      return withSign(content, value, signDisplay);
    }

    if (code === "sat") {
      const content = formatSat(locale, abs, currencyDisplay);
      return withSign(content, value, signDisplay);
    }

    const formatted = formatPlain(locale, abs, 2, 2);
    return withSign(formatted, value, signDisplay);
  }, [currency, currencyDisplay, value, signDisplay, locale, derived.code, derived.amount]);

  return (
    <span
      className={cn(className, {
        "text-signal-success": color !== "none" && (type === "credit" || (type === "auto" && derived.amount > 0)),
        "text-signal-error": color !== "none" && (type === "debit" || (type === "auto" && derived.amount < 0)),
      })}
    >
      {formattedValue}
    </span>
  );
};

Currency.displayName = "Currency";

export { Currency };
