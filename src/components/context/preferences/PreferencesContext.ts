import { createContext, useContext } from "react";

export type Theme = "system" | "light" | "dark";
export type Currency = "usd" | "eur" | "btc" | "sat";
export type DecimalFormat = "point" | "comma" | "space";

type PreferencesContext = {
  theme: Theme;
  currency: Currency;
  decimalFormat: DecimalFormat;
  currentTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  setCurrency: (currency: Currency) => void;
  setDecimalFormat: (decimalFormat: DecimalFormat) => void;
};

export const PreferencesContext = createContext<PreferencesContext | undefined>(undefined);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }

  return context;
};

const STORAGE_KEY = "user-preferences";
const THEME_STORAGE_KEY = "theme";
const isTheme = (value: unknown): value is Theme => value === "system" || value === "light" || value === "dark";

export const getStoredPreferences = (): Partial<PreferencesContext> => {
  const fallbackTheme = localStorage.getItem(THEME_STORAGE_KEY);

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<PreferencesContext>) : {};

    // Keep localStorage("theme") as the source of truth for startup/theme boot script.
    if (isTheme(fallbackTheme)) {
      parsed.theme = fallbackTheme;
    }

    return parsed;
  } catch {
    if (isTheme(fallbackTheme)) {
      return { theme: fallbackTheme };
    }
    return {};
  }
};

export const savePreferences = (prefs: Partial<PreferencesContext>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    if (isTheme(prefs.theme)) {
      localStorage.setItem(THEME_STORAGE_KEY, prefs.theme);
    }
  } catch {
    console.error("Failed to save preferences");
  }
};
