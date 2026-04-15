import React, { useEffect, useState } from "react";

import type { Currency, DecimalFormat, Theme } from "./PreferencesContext";
import { getStoredPreferences, PreferencesContext, savePreferences } from "./PreferencesContext";

const detectDefaultDecimalFormat = (): DecimalFormat => {
  const locale = navigator.language || "en-US";
  const testNumber = 1.5;
  const formatted = new Intl.NumberFormat(locale).format(testNumber);

  if (formatted.includes(",5")) {
    if (formatted.includes(" ")) {
      return "space"; // Format: 1 000,00
    }
    return "point"; // Format: 1.000,00
  }
  // Default to comma format (1,000.00)
  return "comma";
};

export const PreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const stored = getStoredPreferences();

  const [theme, setThemeState] = useState<Theme>(stored.theme ?? "system");
  const [currency, setCurrencyState] = useState<Currency>(stored.currency ?? "sat");
  const [decimalFormat, setDecimalFormatState] = useState<DecimalFormat>(stored.decimalFormat ?? detectDefaultDecimalFormat());
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  const detectSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  useEffect(() => {
    const retrieveSystemTheme = () => {
      const appliedTheme = theme === "system" ? detectSystemTheme() : theme;

      setCurrentTheme(appliedTheme);

      document.documentElement.setAttribute("data-theme", appliedTheme);
    };

    retrieveSystemTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => {
        retrieveSystemTheme();
      };

      mediaQuery.addEventListener("change", handler);

      return () => {
        mediaQuery.removeEventListener("change", handler);
      };
    }
  }, [theme]);

  useEffect(() => {
    const persistedTheme = localStorage.getItem("theme");
    const themeToPersist = persistedTheme === "light" || persistedTheme === "dark" || persistedTheme === "system" ? persistedTheme : theme;

    savePreferences({ theme: themeToPersist, currency, decimalFormat });
  }, [theme, currency, decimalFormat]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const setDecimalFormat = (format: DecimalFormat) => {
    setDecimalFormatState(format);
  };

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        currency,
        decimalFormat,
        currentTheme,
        setTheme,
        setCurrency,
        setDecimalFormat,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};
