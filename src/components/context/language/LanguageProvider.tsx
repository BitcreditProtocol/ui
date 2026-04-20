import React, { useEffect, useMemo, useState } from "react";
import { IntlProvider } from "react-intl";

import { DEFAULT_LOCALE, LanguageContext } from "./LanguageContext";

type TranslationMessages = Record<string, string>;

const modules = import.meta.glob<Record<string, TranslationMessages>>("@/i18n/**/translation.json", {
  eager: true,
});

const translations: { [key: string]: Record<string, string> } = {};
const CANONICAL_LOCALE_BY_LANGUAGE: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  de: "de-DE",
  it: "it-IT",
  tr: "tr-TR",
  ach: "ach-UG",
};

for (const path in modules) {
  const match = path.match(/\/i18n\/(\w+-\w+)\/.*\.json$/);

  if (match) {
    const locale = match[1];
    const fileContent = modules[path];
    const content = fileContent.default;

    if (typeof content === "object") {
      translations[locale] = content;
    } else {
      console.warn(`Invalid JSON in file: ${path}`);
    }
  }
}

const availableLocales = Object.keys(translations);

function resolveLocale({ saved, browser, fallback = "en-US" }: { saved?: string | null; browser?: string | null; fallback?: string }) {
  const normalizeLocale = (locale?: string | null) => locale?.toLowerCase() ?? null;
  const resolveAvailableLocale = (locale?: string | null) => {
    const normalizedLocale = normalizeLocale(locale);
    if (!normalizedLocale) {
      return undefined;
    }

    return availableLocales.find((availableLocale) => availableLocale.toLowerCase() === normalizedLocale);
  };
  const savedLocale = resolveAvailableLocale(saved);
  const browserLocale = resolveAvailableLocale(browser);
  const browserLanguage = browser?.split("-")[0]?.toLowerCase();

  if (savedLocale) {
    return savedLocale;
  }
  if (browserLanguage) {
    const canonicalCandidate = resolveAvailableLocale(CANONICAL_LOCALE_BY_LANGUAGE[browserLanguage]);
    if (canonicalCandidate) {
      return canonicalCandidate;
    }
    const candidate = availableLocales.find((availableLocale) => availableLocale.toLowerCase().startsWith(`${browserLanguage}-`));
    if (candidate) return candidate;
  }
  if (browserLocale) {
    return browserLocale;
  }
  const fallbackLocale = resolveAvailableLocale(fallback);
  if (fallbackLocale) {
    return fallbackLocale;
  }
  return availableLocales[0] ?? DEFAULT_LOCALE;
}

export function LanguageProvider({
  defaultLocale = DEFAULT_LOCALE,
  initWithBrowserLocale: shouldInitWithBrowserLocale = true,
  children,
}: {
  defaultLocale?: string;
  initWithBrowserLocale?: boolean;
  children: React.ReactNode;
}) {
  const saved = typeof window !== "undefined" ? window.localStorage.getItem("app.locale") : null;
  const browser = shouldInitWithBrowserLocale ? navigator.language : null;
  const initialLocale = resolveLocale({ saved, browser, fallback: "en-US" });

  const [locale, setLocale] = useState(initialLocale || defaultLocale);
  const messages = useMemo(() => translations[locale], [locale]);

  useEffect(() => {
    try {
      window.localStorage.setItem("app.locale", locale);
    } catch {
      // Intentionally ignore storage errors (private mode or blocked storage)
    }
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, availableLocales: () => availableLocales }}>
      <IntlProvider defaultLocale={DEFAULT_LOCALE} locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
}
