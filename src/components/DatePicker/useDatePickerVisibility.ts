import React, { useCallback, useEffect, useState } from "react";

export function useDatePickerVisibility() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const closeBlockerTimeoutRef = React.useRef<number | null>(null);

  useEffect(
    () => () => {
      if (closeBlockerTimeoutRef.current !== null) {
        window.clearTimeout(closeBlockerTimeoutRef.current);
      }
    },
    []
  );

  const startCloseBlocker = useCallback(() => {
    setIsClosing(true);
    if (closeBlockerTimeoutRef.current !== null) {
      window.clearTimeout(closeBlockerTimeoutRef.current);
    }
    closeBlockerTimeoutRef.current = window.setTimeout(() => {
      setIsClosing(false);
      closeBlockerTimeoutRef.current = null;
    }, 350);
  }, []);

  const openCalendar = useCallback(() => {
    setIsClosing(false);
    if (closeBlockerTimeoutRef.current !== null) {
      window.clearTimeout(closeBlockerTimeoutRef.current);
      closeBlockerTimeoutRef.current = null;
    }
    setShowYearPicker(false);
    setShowMonthPicker(false);
    setShowCalendar(true);
  }, []);

  const openYearPicker = useCallback(() => {
    setShowYearPicker(true);
    setShowMonthPicker(false);
  }, []);

  const closePicker = useCallback(() => {
    setShowMonthPicker(false);
    setShowYearPicker(false);
    setShowCalendar(false);
    startCloseBlocker();
  }, [startCloseBlocker]);

  return {
    showCalendar,
    isClosing,
    showYearPicker,
    setShowYearPicker,
    showMonthPicker,
    setShowMonthPicker,
    openCalendar,
    openYearPicker,
    closePicker,
  };
}
