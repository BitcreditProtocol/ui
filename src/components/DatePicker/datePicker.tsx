import { ArrowRight, CalendarIcon } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useUiText } from "@/components/context/i18n/useUiText";
import { useLanguage } from "@/components/context/language/LanguageContext";
import { Calendar, type CalendarSelectHandler } from "@/components/DatePicker/calendar";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UiMessages, UiT } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";
import {
  addDays,
  type DateRange,
  dateMatchModifiers,
  differenceInCalendarDays,
  formatIsoDateShort,
  isSameDay,
  type Matcher,
} from "@/utils/dates";

import { DateRangeDropdown } from "./dateRangeDropdown";
import { MonthPicker } from "./monthPicker";
import { YearPicker } from "./yearPicker";

interface DatePickerProps {
  className?: string;
  label?: string;
  mode: "single" | "range";
  value?: DateRange;
  onChange: (dateRange: DateRange | undefined) => void;
  customComponent?: React.ReactElement<{
    onClick?: React.MouseEventHandler;
  }>;
  disabled?: Matcher | Matcher[] | undefined;
  shouldDisplayIncrementButtons?: boolean;
  isFutureNavigationDisabled?: boolean;
  isAutoSelectDisabled?: boolean;
  currentYearPosition?: "start" | "center" | "end";
  order?: "asc" | "desc";
  dateFilterType?: "issue" | "maturity";
  onDateFilterTypeChange?: (type: "issue" | "maturity") => void;
  withTime?: boolean;
  timeFormat?: "12h" | "24h";
  messages?: UiMessages;
  t?: UiT;
}

const isSameOrBothMissing = (a?: Date, b?: Date) => {
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return isSameDay(a, b);
};

const isSameRange = (a?: DateRange, b?: DateRange) => isSameOrBothMissing(a?.from, b?.from) && isSameOrBothMissing(a?.to, b?.to);

const cloneDate = (date?: Date) => (date ? new Date(date) : undefined);

const cloneRange = (range?: DateRange): DateRange => ({
  from: cloneDate(range?.from),
  to: cloneDate(range?.to),
});

const formatDisplayDate = (date: Date | undefined, locale: string) => (date ? formatIsoDateShort(date, locale) : "");

const getTimeString = (date?: Date, format: "12h" | "24h" = "24h") => {
  if (!date) return "";
  const h = date.getHours();
  const m = date.getMinutes();
  if (format === "24h") {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
};

const applyTimeToDate = (date: Date, timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);
  return next;
};

const formatDisplayDateTime = (date: Date | undefined, locale: string, timeFormat: "12h" | "24h" = "24h") =>
  date ? `${formatIsoDateShort(date, locale)}, ${getTimeString(date, timeFormat)}` : "";

const ITEM_H = 40;
const VISIBLE_COUNT = 5;
const REPEAT_COUNT = 5; // repeat item list this many times for infinite illusion
const HOURS_24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES_LIST = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const AM_PM = ["AM", "PM"];

interface ScrollColumnProps {
  items: string[];
  selectedIndex: number;
  onChange: (i: number) => void;
  disabled?: boolean;
  infinite?: boolean;
}

function ScrollColumn({ items, selectedIndex, onChange, disabled, infinite = true }: ScrollColumnProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isProgrammatic = React.useRef(false);
  const mounted = React.useRef(false);
  const debounce = React.useRef<number | null>(null);
  // For infinite columns: always snap back to the middle repetition
  const middleStart = infinite ? items.length * Math.floor(REPEAT_COUNT / 2) : 0;

  const commit = useCallback(() => {
    if (isProgrammatic.current) return;
    const el = ref.current;
    if (!el) return;
    const virtualIndex = Math.round(el.scrollTop / ITEM_H);
    if (infinite) {
      const normalized = ((virtualIndex % items.length) + items.length) % items.length;
      onChange(normalized);
      // Instantly re-anchor to the middle repetition so scroll stays infinite
      isProgrammatic.current = true;
      el.scrollTop = (middleStart + normalized) * ITEM_H;
      window.setTimeout(() => {
        isProgrammatic.current = false;
      }, 50);
    } else {
      const normalized = Math.max(0, Math.min(items.length - 1, virtualIndex));
      onChange(normalized);
    }
  }, [infinite, items.length, middleStart, onChange]);

  // scrollend fires after momentum finishes (Chrome 114+, FF 109+)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScrollEnd = () => {
      if (debounce.current !== null) {
        window.clearTimeout(debounce.current);
        debounce.current = null;
      }
      commit();
    };
    el.addEventListener("scrollend", onScrollEnd, { passive: true });
    return () => el.removeEventListener("scrollend", onScrollEnd);
  }, [commit]);

  // Debounce fallback for browsers without scrollend
  const handleScroll = useCallback(() => {
    if (isProgrammatic.current) return;
    if (debounce.current !== null) window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => {
      commit();
      debounce.current = null;
    }, 80);
  }, [commit]);

  // Scroll to selectedIndex in the middle repetition
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    isProgrammatic.current = true;
    const top = (middleStart + selectedIndex) * ITEM_H;
    if (!mounted.current) {
      mounted.current = true;
      el.scrollTop = top;
      isProgrammatic.current = false;
    } else {
      el.scrollTo({ top, behavior: "smooth" });
      const t = window.setTimeout(() => {
        isProgrammatic.current = false;
      }, 400);
      return () => window.clearTimeout(t);
    }
  }, [selectedIndex, middleStart]);

  const allItems = useMemo(() => (infinite ? Array.from({ length: REPEAT_COUNT }, () => items).flat() : items), [infinite, items]);
  const pad = Math.floor(VISIBLE_COUNT / 2) * ITEM_H;

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      style={{
        height: ITEM_H * VISIBLE_COUNT,
        maskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
        scrollbarWidth: "none",
      }}
      className={cn(
        "overflow-y-scroll snap-y snap-mandatory overscroll-y-contain touch-pan-y [&::-webkit-scrollbar]:hidden w-12",
        disabled && "pointer-events-none opacity-40"
      )}
    >
      <div style={{ height: pad }} aria-hidden />
      {allItems.map((item, i) => {
        const normalizedI = i % items.length;
        const isSelected = normalizedI === selectedIndex;
        return (
          <div
            key={i}
            style={{ height: ITEM_H }}
            className={cn(
              "snap-center flex items-center justify-center select-none",
              isSelected ? "font-semibold text-base" : "text-text-200 text-sm cursor-pointer"
            )}
            onClick={() => {
              if (disabled) return;
              onChange(normalizedI);
            }}
          >
            {item}
          </div>
        );
      })}
      <div style={{ height: pad }} aria-hidden />
    </div>
  );
}

interface TimeInputProps {
  value?: Date;
  format?: "12h" | "24h";
  disabled?: boolean;
  onChange: (timeStr: string) => void;
  className?: string;
}

function TimeInput({ value, format = "24h", disabled, onChange, className }: TimeInputProps) {
  const h24 = value?.getHours() ?? 0;
  const minutes = value?.getMinutes() ?? 0;
  const isPM = h24 >= 12;
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;

  const handleHourChange = useCallback(
    (i: number) => {
      if (format === "24h") {
        onChange(`${String(i).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
      } else {
        const h = i + 1; // index 0–11 → hour 1–12
        const next24 = isPM ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
        onChange(`${String(next24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
      }
    },
    [format, isPM, minutes, onChange]
  );

  const handleMinuteChange = useCallback(
    (i: number) => {
      onChange(`${String(h24).padStart(2, "0")}:${String(i).padStart(2, "0")}`);
    },
    [h24, onChange]
  );

  const handleAmPmChange = useCallback(
    (i: number) => {
      const newIsPM = i === 1;
      if (newIsPM === isPM) return;
      onChange(`${String(newIsPM ? h24 + 12 : h24 - 12).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
    },
    [isPM, h24, minutes, onChange]
  );

  const hourIndex = format === "24h" ? h24 : h12 - 1;

  return (
    <div className={cn("relative flex items-center", className)}>
      <div
        className="absolute inset-x-0 rounded-xl bg-elevation-200 dark:bg-elevation-300 pointer-events-none"
        style={{ top: Math.floor(VISIBLE_COUNT / 2) * ITEM_H, height: ITEM_H }}
        aria-hidden
      />
      <ScrollColumn
        items={format === "24h" ? HOURS_24 : HOURS_12}
        selectedIndex={hourIndex}
        onChange={handleHourChange}
        disabled={disabled}
      />
      <span className="text-text-200 font-medium select-none z-10 pb-0.5">:</span>
      <ScrollColumn items={MINUTES_LIST} selectedIndex={minutes} onChange={handleMinuteChange} disabled={disabled} />
      {format === "12h" && (
        <ScrollColumn items={AM_PM} selectedIndex={isPM ? 1 : 0} onChange={handleAmPmChange} disabled={disabled} infinite={false} />
      )}
    </div>
  );
}

export function DatePicker({
  label,
  mode,
  value,
  onChange,
  customComponent,
  disabled,
  shouldDisplayIncrementButtons = false,
  className,
  isFutureNavigationDisabled = false,
  isAutoSelectDisabled = true,
  currentYearPosition = "start",
  order = "asc",
  dateFilterType = "issue",
  onDateFilterTypeChange,
  withTime = false,
  timeFormat = "24h",
  messages,
  t,
}: DatePickerProps) {
  const uiText = useUiText();
  const lang = useLanguage();
  const [showCalendar, setShowCalendar] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState<number>();
  const allowRangeSelection = useMemo(() => mode === "range", [mode]);
  const formatDate = withTime
    ? (date: Date | undefined, locale: string) => formatDisplayDateTime(date, locale, timeFormat)
    : formatDisplayDate;
  const [hasBeenCleared, setHasBeenCleared] = useState(false);
  const closeBlockerTimeoutRef = React.useRef<number | null>(null);

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
  const [rangeFocus, setRangeFocus] = useState<"from" | "to">("from");
  const lastFooterTouchAtRef = React.useRef(0);
  const previousValueRef = React.useRef(value);
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

  const toggleCalendar = useCallback(() => {
    setShowCalendar((isPrev) => {
      const shouldOpen = !isPrev;

      if (shouldOpen) {
        setIsClosing(false);
        if (closeBlockerTimeoutRef.current !== null) {
          window.clearTimeout(closeBlockerTimeoutRef.current);
          closeBlockerTimeoutRef.current = null;
        }
        setDraft(cloneRange(current));
        setShowYearPicker(false);
        setShowMonthPicker(false);
      } else {
        setShowYearPicker(false);
        setShowMonthPicker(false);
        startCloseBlocker();
      }

      return shouldOpen;
    });
  }, [current, startCloseBlocker]);

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

  const clearSelection = () => {
    const clearedRange: DateRange = {
      from: draft.from || current.from,
      to: undefined,
    };
    setSelectedRange(undefined);
    setDraft(clearedRange);
    setCurrent(clearedRange);
    onChange(clearedRange);
    setHasBeenCleared(true);
    setRangeFocus("to");
    setShowMonthPicker(false);
    setShowYearPicker(false);
  };

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

  const handleCancel = useCallback(() => {
    closePicker();
  }, [closePicker]);

  const handleConfirm = useCallback(() => {
    const nextRange = cloneRange(draft);
    setCurrent(nextRange);
    onChange(nextRange);
    closePicker();
  }, [draft, onChange, closePicker]);

  const runFooterTouchAction = useCallback((action: () => void) => {
    lastFooterTouchAtRef.current = Date.now();
    action();
  }, []);

  const shouldIgnoreFooterClick = useCallback((detail: number) => {
    const isRecentTouch = Date.now() - lastFooterTouchAtRef.current < 300;
    return isRecentTouch && detail > 0;
  }, []);

  const handleFooterPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>, action: () => void) => {
      event.stopPropagation();
      event.preventDefault();
      runFooterTouchAction(action);
    },
    [runFooterTouchAction]
  );

  return (
    <>
      {customComponent ? (
        React.cloneElement(customComponent, {
          onClick: (e: React.MouseEvent) => {
            customComponent.props.onClick?.(e);
            if (e.defaultPrevented) {
              return;
            }
            toggleCalendar();
          },
        })
      ) : (
        <Button
          type="button"
          variant="outline"
          className={
            "w-full flex gap-1.5 justify-start items-center bg-elevation-200 text-sm font-medium peer h-[58px] rounded-lg border-divider-50 p-4"
          }
          onClick={toggleCalendar}
        >
          <AppIcon icon={CalendarIcon} className="text-text-300" size="md" />

          {mode === "single" ? (
            current.from ? (
              formatDate(current.from, lang.locale)
            ) : (
              label
            )
          ) : (
            <>
              {current.from && formatDate(current.from, lang.locale)}
              <span>-</span>
              {current.to && formatDate(current.to, lang.locale)}
            </>
          )}
        </Button>
      )}

      <div
        className={cn(
          "fixed inset-0 bg-black/30 transition-opacity duration-300 max-w-[430px] mx-auto",
          showCalendar
            ? "opacity-100 visible z-50"
            : isClosing
              ? "opacity-0 visible pointer-events-auto z-50"
              : "opacity-0 invisible pointer-events-none z-0"
        )}
        onClick={closePicker}
        aria-hidden={!showCalendar && !isClosing}
      />

      <div
        className={cn(
          `fixed bottom-0 z-50 left-1/2 -translate-x-1/2 max-w-[430px] w-full h-auto bg-elevation-50 dark:bg-elevation-250 px-4 py-5 transition-transform duration-300 ease-in-out rounded-t-2xl justify-center overflow-y-auto`,
          showCalendar ? "translate-y-0 visible pointer-events-auto" : "translate-y-full invisible pointer-events-none",
          className
        )}
      >
        <div className="flex flex-col gap-2 min-h-full">
          <div className="flex flex-col gap-2">
            {allowRangeSelection ? (
              <>
                <div className="text-xs text-text-200">
                  {uiText({ key: "ui.datePicker.filterBy", legacyKey: "bills.list.filter.by", messages, t })}
                </div>

                <Tabs
                  value={dateFilterType}
                  onValueChange={(value) => {
                    if (onDateFilterTypeChange) {
                      onDateFilterTypeChange(value as "issue" | "maturity");
                    }
                  }}
                  className="w-full"
                >
                  <TabsList className="gap-0.5 w-full p-0 border-divider-50 bg-elevation-200">
                    <TabsTrigger value="issue" className="flex items-center gap-1 py-2 bg-elevation-200">
                      {uiText({ key: "ui.datePicker.issueDate", legacyKey: "bills.list.filter.date.issue", messages, t })}
                    </TabsTrigger>
                    <TabsTrigger value="maturity" className="flex items-center gap-1 py-2 bg-elevation-200">
                      {uiText({ key: "ui.datePicker.maturityDate", legacyKey: "bills.list.filter.date.maturity", messages, t })}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="text-xs text-text-200">
                  {uiText({ key: "ui.datePicker.range.selectLabel", legacyKey: "datePicker.range.selectRange", messages, t })}
                </div>

                <DateRangeDropdown
                  value={selectedRange}
                  onRangeChange={setSelectedRange}
                  messages={messages}
                  t={t}
                  onClear={() => {
                    clearSelection();
                  }}
                />

                <div className="grid grid-cols-9 text-sm">
                  <div className="col-span-4">
                    <button
                      type="button"
                      onClick={() => {
                        setRangeFocus("from");
                      }}
                      className={cn(
                        "h-[46px] py-3 px-4 w-full bg-elevation-200 border rounded-lg truncate text-left",
                        rangeFocus === "from" ? "border-brand-200" : "border-gray-200"
                      )}
                    >
                      {draft.from && formatDisplayDate(draft.from, lang.locale)}
                      {!draft.from && (
                        <span className="text-text-200">
                          {uiText({ key: "ui.datePicker.range.start", legacyKey: "datePicker.range.start", messages, t })}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="col-auto flex justify-center items-center">
                    <AppIcon icon={ArrowRight} className="text-text-200" size={24} />
                  </div>

                  <div className="col-span-4">
                    <button
                      type="button"
                      onClick={() => {
                        setRangeFocus("to");
                      }}
                      className={cn(
                        "h-[46px] py-3 pl-4 pr-2 w-full bg-elevation-200 border rounded-lg truncate text-left",
                        rangeFocus === "to" ? "border-brand-200" : "border-gray-200"
                      )}
                    >
                      {draft.to && formatDisplayDate(draft.to, lang.locale)}
                      {!draft.to && (
                        <span className="text-text-200">
                          {uiText({ key: "ui.datePicker.range.end", legacyKey: "datePicker.range.end", messages, t })}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-text-200">
                    {uiText({ key: "ui.datePicker.single.selectedDate", legacyKey: "datePicker.single.selectedDate", messages, t })}
                  </div>
                  {shouldDisplayIncrementButtons && (
                    <div className="flex items-center gap-0.5">
                      {[30, 60, 90, 120].map((days) => (
                        <button
                          key={days}
                          className="bg-elevation-200/70 p-1.5 rounded-sm text-text-300 text-[10px] font-medium"
                          onClick={() => {
                            const base = current.from ?? new Date(); // always start from confirmed date
                            const newDate = addDays(base, days);

                            setDraft({
                              from: newDate,
                              to: mode === "range" ? addDays(newDate, days) : undefined,
                            });
                          }}
                        >
                          +{days}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-base">{displayedSingleDate ? formatDate(displayedSingleDate, lang.locale) : "-"}</div>
              </div>
            )}
          </div>

          <div className={cn("mb-4 flex flex-col sm:flex-row sm:gap-3 sm:items-center", withTime && "gap-3")}>
            <div>
              {showYearPicker && (
                <YearPicker
                  key={(draft.from || baseDate).getFullYear()}
                  value={draft.from || baseDate}
                  onChange={(date) => {
                    setDraft({
                      ...draft,
                      from: date,
                    });
                    setShowYearPicker(false);
                    setShowMonthPicker(true);
                  }}
                  onCaptionLabelClicked={() => {
                    setShowYearPicker(false);
                    setShowMonthPicker(false);
                  }}
                  shouldDisableFutureNavigation={isFutureNavigationDisabled}
                  currentYearPosition={currentYearPosition}
                  order={order}
                />
              )}
              {showMonthPicker && (
                <MonthPicker
                  value={draft.from || baseDate}
                  onChange={(date) => {
                    setDraft({
                      ...draft,
                      from: date,
                    });
                    setShowYearPicker(false);
                    setShowMonthPicker(false);
                  }}
                  onCaptionLabelClicked={() => {
                    setShowYearPicker(true);
                    setShowMonthPicker(false);
                  }}
                  shouldDisableFutureNavigation={isFutureNavigationDisabled}
                />
              )}
              {!showYearPicker && !showMonthPicker && (
                <Calendar
                  mode={mode}
                  selected={draft}
                  month={calendarMonth}
                  onCaptionLabelClicked={openYearPicker}
                  onSelect={handleCalendarSelect}
                  onMonthChange={handleCalendarMonthChange}
                  disabled={disabled}
                  isFutureNavigationDisabled={isFutureNavigationDisabled}
                  modifiers={calendarModifiers}
                  modifiersClassNames={calendarModifiersClassNames}
                  rangeFocus={rangeFocus}
                />
              )}
            </div>

            {withTime && (
              <div className="flex items-center justify-center gap-2 sm:flex-col sm:items-start sm:justify-start">
                {allowRangeSelection ? (
                  <>
                    <div className="flex flex-col items-center sm:items-start gap-1">
                      <span className="hidden sm:block text-xs text-text-200">From</span>
                      <TimeInput
                        value={draft.from}
                        format={timeFormat}
                        disabled={!draft.from}
                        onChange={(timeStr) => {
                          setDraft((prev) => ({
                            ...prev,
                            from: prev.from ? applyTimeToDate(prev.from, timeStr) : prev.from,
                          }));
                        }}
                      />
                    </div>
                    <AppIcon icon={ArrowRight} className="text-text-200 shrink-0 sm:hidden" size={16} />
                    <div className="flex flex-col items-center sm:items-start gap-1">
                      <span className="hidden sm:block text-xs text-text-200">To</span>
                      <TimeInput
                        value={draft.to}
                        format={timeFormat}
                        disabled={!draft.to}
                        onChange={(timeStr) => {
                          setDraft((prev) => ({
                            ...prev,
                            to: prev.to ? applyTimeToDate(prev.to, timeStr) : prev.to,
                          }));
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <TimeInput
                    value={draft.from}
                    format={timeFormat}
                    disabled={!draft.from}
                    onChange={(timeStr) => {
                      setDraft((prev) => ({
                        ...prev,
                        from: prev.from ? applyTimeToDate(prev.from, timeStr) : prev.from,
                      }));
                    }}
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex gap-1 items-center">
            <Button
              className="w-full border-text-300"
              variant="outline"
              size="sm"
              type="button"
              onPointerDown={(e) => {
                handleFooterPointerDown(e, handleCancel);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (shouldIgnoreFooterClick(e.detail)) {
                  return;
                }
                handleCancel();
              }}
            >
              {uiText({ key: "ui.datePicker.actions.cancel", legacyKey: "datePicker.actions.cancel", messages, t })}
            </Button>
            <Button
              className="w-full"
              size="sm"
              type="button"
              disabled={!canSelect || draft.from === undefined || (mode === "range" && draft.to === undefined)}
              onPointerDown={(e) => {
                handleFooterPointerDown(e, handleConfirm);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (shouldIgnoreFooterClick(e.detail)) {
                  return;
                }
                handleConfirm();
              }}
            >
              {uiText({ key: "ui.datePicker.actions.confirm", legacyKey: "datePicker.actions.confirm", messages, t })}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
