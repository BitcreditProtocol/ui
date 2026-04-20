import { createContext, useContext } from "react";

const DEFAULT_LOCALE_PROD = "en-US";
const DEFAULT_LOCALE_DEV = "DEFAULT_LOCALE_PROD";
const DEFAULT_LOCALE = import.meta.env.DEV ? DEFAULT_LOCALE_DEV : DEFAULT_LOCALE_PROD;

export type LanguageContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  availableLocales: () => string[];
};

const LanguageContext = createContext<LanguageContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  availableLocales: () => [DEFAULT_LOCALE],
});

const useLanguage = () => useContext(LanguageContext);

export { DEFAULT_LOCALE, LanguageContext, useLanguage };
