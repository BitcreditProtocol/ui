import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "amount-visibility";

/**
 * Custom hook to manage amount visibility state across the application.
 * Syncs state with localStorage and across browser tabs/windows.
 */
export function useAmountVisibility(): {
  isAmountVisible: boolean;
  toggleVisibility: () => void;
} {
  const [isAmountVisible, setIsAmountVisible] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null ? (JSON.parse(stored) as boolean) : true;
    } catch {
      return true;
    }
  });

  const toggleVisibility = useCallback(() => {
    setIsAmountVisible((isPrevVisible) => {
      const isNewVisible = !isPrevVisible;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(isNewVisible));
        window.dispatchEvent(
          new CustomEvent("amount-visibility-changed", {
            detail: { isVisible: isNewVisible, value: isNewVisible },
          })
        );
      } catch {
        console.error("Failed to save amount visibility state");
      }
      return isNewVisible;
    });
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: Event) => {
      if (!(e instanceof StorageEvent)) return;

      if (e.key === STORAGE_KEY && e.newValue !== null) {
        try {
          setIsAmountVisible(JSON.parse(e.newValue) as boolean);
        } catch {
          console.error("Failed to parse amount visibility state");
        }
      }
    };

    const handleCustomChange = (e: Event) => {
      if (!(e instanceof CustomEvent)) return;
      const detail = (e as CustomEvent<{ isVisible?: boolean; value?: boolean }>).detail;
      const isVisible = typeof detail.isVisible === "boolean" ? detail.isVisible : detail.value;
      if (typeof isVisible !== "boolean") {
        return;
      }
      setIsAmountVisible(isVisible);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("amount-visibility-changed", handleCustomChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("amount-visibility-changed", handleCustomChange);
    };
  }, []);

  return { isAmountVisible, toggleVisibility };
}
