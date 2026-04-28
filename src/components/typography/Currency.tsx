import React, { useMemo } from "react";
import { type FormatNumberOptions, useIntl } from "react-intl";

import { usePreferences } from "@/components/context/preferences/PreferencesContext";
import { HighlightText } from "@/components/ui/highlight-text";
import { useRates } from "@/hooks/useRates";
import { type CurrencyCode, convert, formatAmountNumber, getLocaleForFormat } from "@/lib/currency";
import { cn } from "@/lib/utils";

export type FormattedCurrencyProps = {
  value: number;
  className?: string;
  amountClassName?: string;
  currencyClassName?: string;
  secondaryClassName?: string;
  color?: "auto" | "none";
  type?: "auto" | "credit" | "debit";
  currency?: FormatNumberOptions["currency"];
  currencyDisplay?: FormatNumberOptions["currencyDisplay"] | "none";
  sourceCurrency?: CurrencyCode;
  showSecondary?: boolean;
  highlightQuery?: string;
} & Pick<FormatNumberOptions, "signDisplay">;

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

// Derive the correct fraction digit counts for any ISO currency (e.g. JPY=0, USD=2)
const getFiatFractionDigits = (locale: string, code: string): { minFrac: number; maxFrac: number } => {
  const opts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code.toUpperCase(),
  }).resolvedOptions();
  return { minFrac: opts.minimumFractionDigits ?? 2, maxFrac: opts.maximumFractionDigits ?? 2 };
};

type FormattedParts = {
  numberStr: string;
  symbolStr: string | null;
  symbolBefore: boolean;
  hasSpaceBetween: boolean;
};

const getFormattedParts = (
  locale: string,
  abs: number,
  code: string,
  currencyDisplay: FormatNumberOptions["currencyDisplay"] | "none"
): FormattedParts => {
  if (code === "btc") {
    return {
      numberStr: formatPlain(locale, abs, 8, 8),
      symbolStr: currencyDisplay !== "none" ? "BTC" : null,
      symbolBefore: false,
      hasSpaceBetween: currencyDisplay !== "none",
    };
  }
  if (code === "sat") {
    return {
      numberStr: formatPlain(locale, abs, 0, 0),
      symbolStr: currencyDisplay !== "none" ? "sat" : null,
      symbolBefore: false,
      hasSpaceBetween: currencyDisplay !== "none",
    };
  }

  // Derive correct fraction digits for the currency (e.g. 0 for JPY, 2 for USD/EUR)
  const { minFrac, maxFrac } = getFiatFractionDigits(locale, code);

  if (currencyDisplay === "none") {
    return { numberStr: formatPlain(locale, abs, minFrac, maxFrac), symbolStr: null, symbolBefore: false, hasSpaceBetween: false };
  }

  const smallestUnit = Math.pow(10, -maxFrac);
  const isSubUnit = abs > 0 && abs < smallestUnit / 2;

  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code.toUpperCase(),
    minimumFractionDigits: minFrac,
    maximumFractionDigits: maxFrac,
    currencyDisplay,
  }).formatToParts(isSubUnit ? smallestUnit : abs);

  const currencyIdx = parts.findIndex((p) => p.type === "currency");
  const integerIdx = parts.findIndex((p) => p.type === "integer");
  const symbolBefore = currencyIdx !== -1 && integerIdx !== -1 && currencyIdx < integerIdx;
  const symbolStr = parts.find((p) => p.type === "currency")?.value ?? null;
  const hasSpaceBetween = symbolStr !== null;

  // Remove the currency part and its adjacent whitespace-only separators.
  // Whitespace-only check (/^\s+$/) preserves bidi control characters (U+200E, U+200F, U+061C)
  // that are not matched by \s and must not be stripped in RTL locales.
  const adjacentToSymbol = new Set<number>();
  if (currencyIdx !== -1) {
    if (currencyIdx > 0 && parts[currencyIdx - 1].type === "literal" && /^\s+$/.test(parts[currencyIdx - 1].value)) {
      adjacentToSymbol.add(currencyIdx - 1);
    }
    if (currencyIdx < parts.length - 1 && parts[currencyIdx + 1].type === "literal" && /^\s+$/.test(parts[currencyIdx + 1].value)) {
      adjacentToSymbol.add(currencyIdx + 1);
    }
  }

  const numberStr = parts
    .filter((p, i) => p.type !== "currency" && !adjacentToSymbol.has(i))
    .map((p) => p.value)
    .join("");

  return {
    numberStr: isSubUnit ? `<${numberStr}` : numberStr,
    symbolStr,
    symbolBefore,
    hasSpaceBetween,
  };
};

// Compute a plain-text accessible label for a currency amount.
// Uses Intl for sign derivation to correctly handle -0, locale sign chars, and all signDisplay modes.
function computeAriaLabel(
  locale: string,
  value: number,
  code: string,
  currencyDisplay: FormatNumberOptions["currencyDisplay"] | "none",
  signDisplay: FormattedCurrencyProps["signDisplay"]
): string {
  const sd = (signDisplay ?? "auto") as Intl.NumberFormatOptions["signDisplay"];

  if (code === "btc" || code === "sat") {
    const signPart = new Intl.NumberFormat(locale, { signDisplay: sd })
      .formatToParts(value)
      .find((p) => p.type === "minusSign" || p.type === "plusSign");
    const sign = signPart?.value ?? "";
    const abs = Math.abs(value);
    const [minFrac, maxFrac] = code === "btc" ? [8, 8] : [0, 0];
    const num = formatPlain(locale, abs, minFrac, maxFrac);
    const symbol = currencyDisplay !== "none" ? (code === "btc" ? " BTC" : " sat") : "";
    return `${sign}${num}${symbol}`;
  }

  if (currencyDisplay === "none") {
    const { minFrac, maxFrac } = getFiatFractionDigits(locale, code);
    const signPart = new Intl.NumberFormat(locale, { signDisplay: sd })
      .formatToParts(value)
      .find((p) => p.type === "minusSign" || p.type === "plusSign");
    const sign = signPart?.value ?? "";
    const num = formatPlain(locale, Math.abs(value), minFrac, maxFrac);
    return `${sign}${num}`;
  }

  // Fiat with symbol: Intl produces the full correctly-formatted string including sign and symbol
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code.toUpperCase(),
    currencyDisplay: currencyDisplay as Intl.NumberFormatOptions["currencyDisplay"],
    signDisplay: sd,
  }).format(value);
}

const symbolClass = "text-text-200 text-xs font-normal leading-normal";

type BaseProps = Omit<FormattedCurrencyProps, "sourceCurrency" | "showSecondary" | "secondaryClassName"> & {
  /** When true, wraps the visual output in aria-hidden (used inside CurrencyWithConversion). */
  srHidden?: boolean;
};

function CurrencyBase({
  value,
  className,
  amountClassName,
  currencyClassName,
  color = "auto",
  type = "auto",
  currency,
  currencyDisplay = "symbol",
  signDisplay = "exceptZero",
  highlightQuery,
  srHidden = false,
}: BaseProps) {
  const { currency: selected, decimalFormat } = usePreferences();
  const intl = useIntl();
  const locale = getLocaleForFormat(intl.locale, decimalFormat);

  const code = useMemo(() => (currency ?? selected).toLowerCase(), [currency, selected]);
  const abs = Math.abs(value);

  const parts = useMemo(() => getFormattedParts(locale, abs, code, currencyDisplay), [locale, abs, code, currencyDisplay]);

  // Separate memo: aria-label depends on signed value and signDisplay, not just abs
  const ariaLabel = useMemo(
    () => computeAriaLabel(locale, value, code, currencyDisplay, signDisplay),
    [locale, value, code, currencyDisplay, signDisplay]
  );

  const numberNode = useMemo(
    () => (
      <span className={amountClassName}>
        <HighlightText text={parts.numberStr} highlight={highlightQuery ?? ""} />
      </span>
    ),
    [amountClassName, parts.numberStr, highlightQuery]
  );

  const symbolNode = parts.symbolStr ? (
    <span className={cn(symbolClass, currencyClassName)} aria-hidden>
      {parts.symbolStr}
    </span>
  ) : null;

  return (
    <span
      aria-hidden={srHidden || undefined}
      className={cn(className, {
        "text-signal-success": color !== "none" && (type === "credit" || (type === "auto" && value > 0)),
        "text-signal-error": color !== "none" && (type === "debit" || (type === "auto" && value < 0)),
      })}
    >
      {/* Visual content hidden from SR; accessible text provided by sr-only sibling */}
      <span aria-hidden="true">
        {withSign(
          <>
            {parts.symbolBefore ? symbolNode : null}
            {parts.symbolBefore && parts.hasSpaceBetween ? " " : null}
            {numberNode}
            {!parts.symbolBefore && parts.hasSpaceBetween ? " " : null}
            {!parts.symbolBefore ? symbolNode : null}
          </>,
          value,
          signDisplay
        )}
      </span>
      {!srHidden ? <span className="sr-only">{ariaLabel}</span> : null}
    </span>
  );
}

function CurrencyWithConversion({
  value,
  sourceCurrency,
  currency,
  showSecondary = true,
  secondaryClassName,
  currencyClassName,
  className,
  color = "auto",
  type = "auto",
  signDisplay = "exceptZero",
  highlightQuery,
  currencyDisplay = "symbol",
  ...rest
}: FormattedCurrencyProps & { sourceCurrency: CurrencyCode }) {
  const { currency: preferred, decimalFormat } = usePreferences();
  const intl = useIntl();
  const locale = getLocaleForFormat(intl.locale, decimalFormat);
  const { data: rates } = useRates();

  const displayCurrency = (currency ?? preferred) as CurrencyCode;

  const secondaryValue = useMemo(() => {
    if (!rates || displayCurrency === sourceCurrency) return null;
    try {
      return convert(value, sourceCurrency, displayCurrency, rates);
    } catch {
      return null;
    }
  }, [rates, value, sourceCurrency, displayCurrency]);

  const secondaryFormatted = useMemo(() => {
    if (secondaryValue === null) return null;
    return formatAmountNumber(Math.abs(secondaryValue), displayCurrency, locale);
  }, [secondaryValue, displayCurrency, locale]);

  // Respect currencyDisplay="none" for the secondary symbol as well
  const secondarySymbol =
    currencyDisplay !== "none"
      ? displayCurrency === "btc"
        ? "BTC"
        : displayCurrency === "sat"
          ? "sat"
          : displayCurrency.toUpperCase()
      : null;

  const showSecondaryDisplay = showSecondary && secondaryFormatted !== null && secondaryValue !== null;

  // Combine primary + secondary into a single accessible label on the outer wrapper.
  // Both child spans are aria-hidden so SR reads only this label, not fragmented pieces.
  const primaryAriaLabel = useMemo(
    () => computeAriaLabel(locale, value, sourceCurrency, currencyDisplay, signDisplay),
    [locale, value, sourceCurrency, currencyDisplay, signDisplay]
  );
  const secondaryAriaLabel = useMemo(
    () =>
      secondaryValue !== null && showSecondaryDisplay
        ? computeAriaLabel(locale, secondaryValue, displayCurrency, currencyDisplay, signDisplay)
        : null,
    [locale, secondaryValue, showSecondaryDisplay, displayCurrency, currencyDisplay, signDisplay]
  );
  const outerAriaLabel = secondaryAriaLabel ? `${primaryAriaLabel}, ${secondaryAriaLabel}` : primaryAriaLabel;

  return (
    <span
      className={cn("inline-flex items-baseline gap-2", className, {
        "text-signal-success": color !== "none" && (type === "credit" || (type === "auto" && value > 0)),
        "text-signal-error": color !== "none" && (type === "debit" || (type === "auto" && value < 0)),
      })}
    >
      <CurrencyBase
        value={value}
        currency={sourceCurrency}
        color="none"
        type="auto"
        signDisplay={signDisplay}
        highlightQuery={highlightQuery}
        currencyClassName={currencyClassName}
        currencyDisplay={currencyDisplay}
        {...rest}
        srHidden={true}
      />
      {showSecondaryDisplay && secondaryValue !== null && secondaryFormatted !== null ? (
        <span className={cn("inline-flex items-baseline gap-1 text-sm text-muted-foreground", secondaryClassName)}>
          <span>{withSign(<HighlightText text={secondaryFormatted} highlight={highlightQuery ?? ""} />, secondaryValue, signDisplay)}</span>
          {secondarySymbol ? <span className={cn(symbolClass, currencyClassName)}>{secondarySymbol}</span> : null}
        </span>
      ) : null}
      <span className="sr-only">{outerAriaLabel}</span>
    </span>
  );
}

// Skip CurrencyWithConversion (and its useRates() call) when secondary display is disabled
const Currency = (props: FormattedCurrencyProps) => {
  if (props.sourceCurrency !== undefined && props.showSecondary !== false) {
    return <CurrencyWithConversion {...props} sourceCurrency={props.sourceCurrency} />;
  }
  return <CurrencyBase {...props} currency={props.sourceCurrency ?? props.currency} />;
};

Currency.displayName = "Currency";

export { Currency };
