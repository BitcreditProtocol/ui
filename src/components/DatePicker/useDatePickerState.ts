import React, { useCallback, useEffect, useMemo, useState } from "react";
import { type CalendarSelectHandler } from "@/components/DatePicker/calendar";
import { addDays, type DateRange, dateMatchModifiers, differenceInCalendarDays, isSameDay, type Matcher } from "@/utils/dates";
import { cloneRange, isSameRange } from "./datePickerUtils";
import type { DatePickerMode, RangeFocus } from "./types";

type UseDatePickerStateOptions = {
  mode: DatePickerMode;
  value?: DateRange;
  disabled?: Matcher | Matcher[];
  isAutoSelectDisabled: boolean;
  showCalendar: boolean;
  showYearPicker: boolean;
  showMonthPicker: boolean;
};

export function useDatePickerState({
  mode,
  value,
  disabled,
  isAutoSelectDisabled,
  showCalendar,
  showYearPicker,
  showMonthPicker,
}: UseDatePickerStateOptions) {
  const [hasBeenCleared, setHasBeenCleared] = useState(false);

  const getInitialDate = () => {
    if (value) {
      return value;
    }
    if (hasBeenCleared) {
      return { from: undefined, to: undefined };
    }
    if (isAutoSelectDisabled) {
      return { from: undefined, to: undefined };
    }
    return { from: new Date(), to: undefined };
  };

  const [current, setCurrent] = useState(getInitialDate());
  const [draft, setDraft] = useState(getInitialDate());
  const [rangeFocus, setRangeFocus] = useState<RangeFocus>("from");
  const [selectedRange, setSelectedRange] = useState<number>();
  const previousValueRef = React.useRef(value);

  const allowRangeSelection = useMemo(() => mode === "range", [mode]);
  const baseDate = useMemo(() => current.from || new Date(), [current.from]);
  const calendarMonth = useMemo(() => draft.from || current.from || new Date(), [draft.from, current.from]);
  const displayedSingleDate = useMemo(() => draft.from || current.from, [draft.from, current.from]);

  const handleCalendarMonthChange = useCallback(
    (newMonth: Date) => {
      setDraft((prev) => {
        const keepDayInMonth = (date: Date | undefined): Date => {
          const day = date ? date.getDate() : 1;
          const lastDay = new Date(newMonth.getFullYear(), newMonth.getMonth() + 1, 0).getDate();
          return new Date(newMonth.getFullYear(), newMonth.getMonth(), Math.min(day, lastDay));
        };

        if (mode === "single") {
          return { ...prev, from: keepDayInMonth(prev.from) };
        }
        if (rangeFocus === "from") {
          return { ...prev, from: keepDayInMonth(prev.from) };
        }
        return { ...prev, to: keepDayInMonth(prev.to) };
      });
    },
    [mode, rangeFocus]
  );

  useEffect(() => {
    if (showCalendar || showYearPicker || showMonthPicker) {
      return;
    }

    if (value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrent((prev) => (isSameRange(prev, value) ? prev : cloneRange(value)));
      setDraft((prev) => (isSameRange(prev, value) ? prev : cloneRange(value)));
      setHasBeenCleared(false);
    } else if (previousValueRef.current) {
      const clearedRange = { from: undefined, to: undefined };
      setCurrent((prev) => (isSameRange(prev, clearedRange) ? prev : clearedRange));
      setDraft((prev) => (isSameRange(prev, clearedRange) ? prev : clearedRange));
      setHasBeenCleared(true);
      setSelectedRange(undefined);
      setRangeFocus("from");
    }

    previousValueRef.current = value;
  }, [showCalendar, showMonthPicker, showYearPicker, value]);

  useEffect(() => {
    if (selectedRange === undefined) {
      return;
    }

    const startDate = draft.from || current.from || new Date();
    const newRange = {
      from: startDate,
      to: addDays(startDate, selectedRange),
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(newRange);
    setDraft(newRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRange]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedRange((val) => {
      if (current.from === undefined || current.to === undefined) {
        return val;
      }
      const diffDays = differenceInCalendarDays(current.to, current.from);
      return diffDays !== val ? undefined : val;
    });
  }, [current]);

  const handleCalendarSelect = useCallback<CalendarSelectHandler>(
    (_ignored: DateRange | undefined, selectedDay) => {
      if (mode === "single") {
        const nextValue = { from: selectedDay, to: undefined };
        setDraft(nextValue);
        return;
      }

      setDraft((prev) => {
        if (rangeFocus === "from") {
          const newTo = prev.to && selectedDay <= prev.to ? prev.to : undefined;
          return { from: selectedDay, to: newTo };
        }
        const from = prev.from || selectedDay;
        return selectedDay < from ? { from: selectedDay, to: from } : { from, to: selectedDay };
      });
      setRangeFocus((prevFocus) => (prevFocus === "from" ? "to" : "from"));
    },
    [mode, rangeFocus]
  );

  const calendarModifiers = useMemo(
    () => ({
      saved: (d: Date) => !!current.from && isSameDay(d, current.from),
    }),
    [current.from]
  );

  const calendarModifiersClassNames = useMemo(
    () => ({
      saved:
        "relative after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-1 after:h-1 after:w-1 after:rounded-full after:bg-text-300/60",
    }),
    []
  );

  const canSelect = useMemo(() => {
    if (!draft.from) {
      return false;
    }

    if (mode === "single") {
      return disabled ? !dateMatchModifiers(draft.from, disabled) : true;
    }

    if (!draft.to) {
      return false;
    }

    const isDisabledFrom = disabled ? dateMatchModifiers(draft.from, disabled) : false;
    const isDisabledTo = disabled ? dateMatchModifiers(draft.to, disabled) : false;

    return !isDisabledFrom && !isDisabledTo;
  }, [draft, disabled, mode]);

  return {
    current,
    setCurrent,
    draft,
    setDraft,
    rangeFocus,
    setRangeFocus,
    selectedRange,
    setSelectedRange,
    hasBeenCleared,
    setHasBeenCleared,
    previousValueRef,
    allowRangeSelection,
    baseDate,
    calendarMonth,
    displayedSingleDate,
    canSelect,
    calendarModifiers,
    calendarModifiersClassNames,
    handleCalendarSelect,
    handleCalendarMonthChange,
  };
}
