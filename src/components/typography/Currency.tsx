import React, { useMemo } from "react";
import { type FormatNumberOptions, useIntl } from "react-intl";

import { usePreferences } from "@/components/context/preferences/PreferencesContext";
import { HighlightText } from "@/components/ui/highlight-text";
import { useRates } from "@/hooks/useRates";
import { convert, formatAmountNumber, getLocaleForFormat, type CurrencyCode } from "@/lib/currency";
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

type FormattedParts = {
  numberStr: string;
  symbolStr: string | null;
  symbolBefore: boolean;
};

const getFormattedParts = (
  locale: string,
  abs: number,
  code: string,
  currencyDisplay: FormatNumberOptions["currencyDisplay"] | "none"
): FormattedParts => {
  if (code === "btc") {
    return { numberStr: formatPlain(locale, abs, 8, 8), symbolStr: currencyDisplay !== "none" ? "BTC" : null, symbolBefore: false };
  }
  if (code === "sat") {
    return { numberStr: formatPlain(locale, abs, 0, 0), symbolStr: currencyDisplay !== "none" ? "sat" : null, symbolBefore: false };
  }
  if (currencyDisplay === "none") {
    return { numberStr: formatPlain(locale, abs, 2, 2), symbolStr: null, symbolBefore: false };
  }

  // USD/EUR — use formatToParts to separate number from symbol
  const isSubCent = abs > 0 && abs < 0.005;
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currencyDisplay,
  }).formatToParts(isSubCent ? 0.01 : abs);

  const currencyIdx = parts.findIndex((p) => p.type === "currency");
  const integerIdx = parts.findIndex((p) => p.type === "integer");
  const symbolBefore = currencyIdx !== -1 && integerIdx !== -1 && currencyIdx < integerIdx;
  const symbolStr = parts.find((p) => p.type === "currency")?.value ?? null;
  const numberStr = parts
    .filter((p) => p.type !== "currency")
    .map((p) => p.value)
    .join("")
    .trim();

  return {
    numberStr: isSubCent ? `<${numberStr}` : numberStr,
    symbolStr,
    symbolBefore,
  };
};

const symbolClass = "text-text-200 text-xs font-normal leading-normal";

type BaseProps = Omit<FormattedCurrencyProps, "sourceCurrency" | "showSecondary" | "secondaryClassName">;

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
}: BaseProps) {
  const { currency: selected, decimalFormat } = usePreferences();
  const intl = useIntl();
  const locale = getLocaleForFormat(intl.locale, decimalFormat);

  const code = useMemo(() => (currency ?? selected).toLowerCase(), [currency, selected]);
  const abs = Math.abs(value);

  const parts = useMemo(() => getFormattedParts(locale, abs, code, currencyDisplay), [locale, abs, code, currencyDisplay]);

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

  const content = (
    <>
      {parts.symbolBefore ? symbolNode : null}
      {numberNode}
      {!parts.symbolBefore ? symbolNode : null}
    </>
  );

  return (
    <span
      className={cn(className, {
        "text-signal-success": color !== "none" && (type === "credit" || (type === "auto" && value > 0)),
        "text-signal-error": color !== "none" && (type === "debit" || (type === "auto" && value < 0)),
      })}
    >
      {withSign(content, value, signDisplay)}
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

  const secondarySymbol = displayCurrency === "btc" ? "BTC" : displayCurrency === "sat" ? "sat" : displayCurrency.toUpperCase();
  const secondarySign = secondaryValue !== null && secondaryValue < 0 ? "-" : "";

  const showSecondaryDisplay = showSecondary && secondaryFormatted !== null;

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
        {...rest}
      />
      {showSecondaryDisplay ? (
        <span className={cn("inline-flex items-baseline gap-1 text-sm text-muted-foreground", secondaryClassName)}>
          <span>
            {secondarySign}
            <HighlightText text={secondaryFormatted} highlight={highlightQuery ?? ""} />
          </span>
          <span className={cn(symbolClass, currencyClassName)} aria-hidden>
            {secondarySymbol}
          </span>
        </span>
      ) : null}
    </span>
  );
}

const Currency = (props: FormattedCurrencyProps) => {
  if (props.sourceCurrency !== undefined) {
    return <CurrencyWithConversion {...props} sourceCurrency={props.sourceCurrency} />;
  }
  return <CurrencyBase {...props} />;
};

Currency.displayName = "Currency";

export { Currency };
