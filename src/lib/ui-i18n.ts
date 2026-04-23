import type { IntlShape } from "react-intl";

export type UiTranslationValues = Record<string, string | number | boolean | null | undefined>;

export const defaultUiMessages = {
  "ui.copyToClipboard.ariaLabel": "Copy to clipboard",
  "ui.copyToClipboard.errorDescription": "Failed to copy {label}.",
  "ui.copyToClipboard.errorTitle": "Copy failed",
  "ui.copyToClipboard.successDescription": "{label} copied to clipboard!",
  "ui.copyToClipboard.successTitle": "Success!",
  "ui.copyToClipboard.valueLabel": "Value",
  "ui.currencySelector.ariaLabel": "Select display currency",
  "ui.currencySelector.description": "Select your preferred display currency",
  "ui.currencySelector.menuLabel": "Display currency",
  "ui.currencySelector.noResults": "No currencies found",
  "ui.currencySelector.option.btc": "Bitcoin (BTC)",
  "ui.currencySelector.option.eur": "Euro",
  "ui.currencySelector.option.sat": "Bitcoin (sat)",
  "ui.currencySelector.option.usd": "US Dollar",
  "ui.currencySelector.resultsCount": "{count, plural, one {# currency} other {# currencies}}",
  "ui.currencySelector.searchPlaceholder": "Search...",
  "ui.currencySelector.title": "Display currency",
  "ui.dateRangeDropdown.clearPresetRange": "Clear preset range",
  "ui.dateRangeDropdown.option.days": "{value} Days",
  "ui.dateRangeDropdown.option.oneYear": "1 Year",
  "ui.dateRangeDropdown.option.selectRange": "Select range",
  "ui.dateRangeDropdown.option.sixMonths": "6 Months",
  "ui.dateRangeDropdown.title": "Select range",
  "ui.datePicker.actions.cancel": "Cancel",
  "ui.datePicker.actions.confirm": "Confirm",
  "ui.datePicker.filterBy": "Filter by",
  "ui.datePicker.issueDate": "Issue date",
  "ui.datePicker.maturityDate": "Maturity date",
  "ui.datePicker.range.end": "End",
  "ui.datePicker.range.selectLabel": "Select date range",
  "ui.datePicker.range.start": "Start",
  "ui.datePicker.single.selectedDate": "Selected date",
  "ui.decimalSeparator.comma": "Comma",
  "ui.decimalSeparator.description": "Select your preferred decimal and thousands separator format",
  "ui.decimalSeparator.menuLabel": "Decimals",
  "ui.decimalSeparator.point": "Point",
  "ui.decimalSeparator.radioLabel": "Select decimal separator format",
  "ui.decimalSeparator.space": "Space",
  "ui.decimalSeparator.title": "Decimals",
  "ui.languagePreference.ariaLabel": "Select language preference",
  "ui.languagePreference.description": "Select your preferred language from the list",
  "ui.languagePreference.groupLabel": "Language selection area",
  "ui.languagePreference.noResults": "No languages found",
  "ui.languagePreference.resultsCount": "{count, plural, one {# language} other {# languages}}",
  "ui.languagePreference.searchPlaceholder": "Search...",
  "ui.languagePreference.title": "Language preference",
  "ui.termsAndConditions.content.summary.heading": "Summary:",
  "ui.termsAndConditions.content.summary.text":
    "Bitcredit's software lets you issue and use bills of exchange digitally. E-Bills have the same key features as handwritten bills but are faster, easier, and cryptographically secure.",
  "ui.termsAndConditions.content.termsOfUse.heading": "Terms of Use:",
  "ui.termsAndConditions.content.termsOfUse.paragraph1":
    "E-Bills reproduce the legal and practical features of handwritten bills of exchange in digital form. They include all required elements and use electronic signatures instead of handwritten ones.",
  "ui.termsAndConditions.content.termsOfUse.paragraph2":
    "The rightful holder of an E-Bill can always be verified through cryptographic proof.",
  "ui.termsAndConditions.content.termsOfUse.paragraph3":
    "By signing or transacting with an E-Bill, you agree that electronic signatures are legally binding.",
  "ui.termsAndConditions.content.termsOfUse.paragraph4":
    "Each party is responsible for reasonable due diligence to confirm the identity of their counterparty.",
  "ui.termsAndConditions.content.termsOfUse.paragraph5":
    "The United Nations Convention on International Bills of Exchange and other applicable international rules apply to all E-Bills, whether domestic or international.",
  "ui.termsAndConditions.content.termsOfUse.paragraph6":
    "Where legally possible, the parties agree to use fast-track court procedures for bill of exchange disputes to ensure quick decisions.",
  "ui.termsAndConditions.content.termsOfUse.paragraph7":
    "If a provision of bill of exchange law cannot apply directly to an E-Bill, the closest permissible alternative with the same economic effect shall apply.",
  "ui.termsAndConditions.content.termsOfUse.paragraph8":
    "If national or international laws recognize E-Bills as equivalent to handwritten bills, those laws will apply automatically.",
  "ui.termsAndConditions.content.title": "Bill of Exchange Agreement",
  "ui.termsAndConditions.page.title": "Terms and Conditions",
  "ui.termsAndConditions.review.description": "Bill of exchange agreement and terms of use for terms and conditions",
  "ui.termsAndConditions.review.terms": "Terms and Conditions",
  "ui.termsAndConditions.review.title": "Terms",
  "ui.theme.dark": "Dark",
  "ui.theme.description": "Select your preferred theme mode",
  "ui.theme.light": "Light",
  "ui.theme.menuLabel": "Theme",
  "ui.theme.system": "System",
  "ui.theme.title": "Theme",
  "ui.upload.label": "Upload document",
} as const;

export type UiTranslationKey = keyof typeof defaultUiMessages;
export type UiMessages = Partial<Record<UiTranslationKey, string>>;
export type UiT = (key: UiTranslationKey, params?: UiTranslationValues) => string | undefined;

type GetUiTextArgs = {
  key: UiTranslationKey;
  params?: UiTranslationValues;
  t?: UiT;
  messages?: UiMessages;
  intl?: IntlShape | null;
  legacyKey?: string;
  legacyParams?: UiTranslationValues;
  devMissingMarker?: boolean;
};

function formatTemplate(template: string, params?: UiTranslationValues) {
  if (!params) {
    return template;
  }

  const withPlurals = template.replace(
    /\{(\w+),\s*plural,\s*one\s*\{([^}]*)\}\s*other\s*\{([^}]*)\}\s*\}/g,
    (_, token, oneCase, otherCase) => {
      const rawValue = params[token];
      const count = typeof rawValue === "number" ? rawValue : Number(rawValue);
      const selectedCase = count === 1 ? oneCase : otherCase;
      return selectedCase.replace(/#/g, String(Number.isNaN(count) ? (rawValue ?? "") : count));
    }
  );

  return withPlurals.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = params[token];
    return value === undefined || value === null ? "" : String(value);
  });
}

function hasIntlMessage(intl: IntlShape | null | undefined, key: string) {
  if (!intl?.messages) {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(intl.messages, key);
}

export function getUiText({
  key,
  params,
  t,
  messages,
  intl,
  legacyKey,
  legacyParams,
  devMissingMarker = import.meta.env.DEV,
}: GetUiTextArgs): string {
  const overrideMessage = messages?.[key];
  if (overrideMessage) {
    return formatTemplate(overrideMessage, params);
  }

  const translated = t?.(key, params);
  if (translated && translated !== key) {
    return translated;
  }

  if (hasIntlMessage(intl, key)) {
    return intl!.formatMessage({ id: key }, params);
  }

  if (legacyKey && hasIntlMessage(intl, legacyKey)) {
    return intl!.formatMessage({ id: legacyKey }, legacyParams ?? params);
  }

  const fallback = defaultUiMessages[key];
  if (fallback) {
    return formatTemplate(fallback, params);
  }

  return devMissingMarker ? `[missing translation: ${key}]` : key;
}
