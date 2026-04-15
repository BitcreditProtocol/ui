import { useCallback, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "system";

const getStorage = (): Storage | null => {
  try {
    const storage = globalThis.localStorage as Partial<Storage> | undefined;
    if (storage && typeof storage.getItem === "function" && typeof storage.setItem === "function") {
      return storage as Storage;
    }
  } catch {
    // ignore and fall back to defaults
  }

  return null;
};

const getStoredTheme = (): Theme => {
  const stored = getStorage()?.getItem("theme");
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }

  return "system";
};

export function useTheme() {
  const getSystemPrefersDark = useCallback(() => window.matchMedia("(prefers-color-scheme: dark)").matches, []);

  const [theme, setTheme] = useState<Theme>(() => {
    return getStoredTheme();
  });

  const [isSystemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    return getSystemPrefersDark();
  });

  const currentTheme = useMemo<"light" | "dark">(() => {
    const isDark = theme === "dark" || (theme === "system" && isSystemPrefersDark);
    return isDark ? "dark" : "light";
  }, [theme, isSystemPrefersDark]);

  const applyTheme = useCallback((nextTheme: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);

  useEffect(() => {
    applyTheme(currentTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemChange = () => {
      setSystemPrefersDark(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [applyTheme, currentTheme]);

  useEffect(() => {
    const reapplyStoredTheme = () => {
      if (document.visibilityState === "hidden") return;
      const storedTheme = getStoredTheme();
      setTheme(storedTheme);
      applyTheme(storedTheme === "system" ? (getSystemPrefersDark() ? "dark" : "light") : storedTheme);
    };

    const onStorageChange = (event: StorageEvent) => {
      if (event.key !== "theme") return;
      reapplyStoredTheme();
    };

    window.addEventListener("pageshow", reapplyStoredTheme);
    document.addEventListener("visibilitychange", reapplyStoredTheme);
    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener("pageshow", reapplyStoredTheme);
      document.removeEventListener("visibilitychange", reapplyStoredTheme);
      window.removeEventListener("storage", onStorageChange);
    };
  }, [applyTheme, getSystemPrefersDark]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    getStorage()?.setItem("theme", newTheme);
    applyTheme(newTheme === "system" ? (getSystemPrefersDark() ? "dark" : "light") : newTheme);
  };

  return { theme, setTheme: changeTheme, currentTheme };
}
