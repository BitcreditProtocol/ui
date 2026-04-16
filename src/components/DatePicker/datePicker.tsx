import { ArrowRight, CalendarIcon } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useLanguage } from "@/components/context/language/LanguageContext";
import { Calendar, type CalendarSelectHandler } from "@/components/DatePicker/calendar";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import { DateRangeDropdown } from "./dataRangeDropdown";
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
}: DatePickerProps) {
  const lang = useLanguage();
  const [showCalendar, setShowCalendar] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState<number>();
  const allowRangeSelection = useMemo(() => mode === "range", [mode]);
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
  const baseDate = useMemo(() => current.from || new Date(), [current.from]);
  const calendarMonth = useMemo(() => draft.from || current.from || new Date(), [draft.from, current.from]);
  const displayedSingleDate = useMemo(() => draft.from || current.from, [draft.from, current.from]);

  useEffect(() => {
    if (showCalendar || showYearPicker || showMonthPicker) {
      return;
    }
    if (value) {
      setCurrent((prev) => (isSameRange(prev, value) ? prev : cloneRange(value)));
      setDraft((prev) => (isSameRange(prev, value) ? prev : cloneRange(value)));
      setHasBeenCleared(false);
    }
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

    setCurrent(newRange);
    setDraft(newRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRange]);

  useEffect(() => {
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
              formatDisplayDate(current.from, lang.locale)
            ) : (
              label
            )
          ) : (
            <>
              {current.from && formatDisplayDate(current.from, lang.locale)}
              <span>-</span>
              {current.to && formatDisplayDate(current.to, lang.locale)}
            </>
          )}
        </Button>
      )}

      <div
        className={cn(
          "fixed inset-0 bg-black/30 transition-opacity duration-300 max-w-[430px] mx-auto",
          showCalendar
            ? "opacity-100 visible z-45"
            : isClosing
              ? "opacity-0 visible pointer-events-auto z-45"
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
                  <FormattedMessage
                    id="bills.list.filter.by"
                    defaultMessage="Filter by"
                    description="Header label for picking which date should be filtered by in datepicker form"
                  />
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
                      <FormattedMessage id="bills.list.filter.date.issue" defaultMessage="Issue date" description="Filter by issue date" />
                    </TabsTrigger>
                    <TabsTrigger value="maturity" className="flex items-center gap-1 py-2 bg-elevation-200">
                      <FormattedMessage
                        id="bills.list.filter.date.maturity"
                        defaultMessage="Maturity date"
                        description="Filter by maturity date"
                      />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="text-xs text-text-200">
                  <FormattedMessage
                    id="Select date range"
                    defaultMessage="Select date range"
                    description="Header label for picking date range in datepicker form"
                  />
                </div>

                <DateRangeDropdown
                  value={selectedRange}
                  onRangeChange={setSelectedRange}
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
                          <FormattedMessage id="range.start" defaultMessage="Start" />
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
                          <FormattedMessage id="range.end" defaultMessage="End" />
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
                    <FormattedMessage
                      id="calendar.date.picker.selected.date"
                      defaultMessage="Selected date"
                      description="Header label for picking single date in datepicker form"
                    />
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
                <div className="text-base">{displayedSingleDate ? formatDisplayDate(displayedSingleDate, lang.locale) : "-"}</div>
              </div>
            )}
          </div>

          <div className="mb-4">
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
                disabled={disabled}
                isFutureNavigationDisabled={isFutureNavigationDisabled}
                modifiers={calendarModifiers}
                modifiersClassNames={calendarModifiersClassNames}
                rangeFocus={rangeFocus}
              />
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
              <FormattedMessage id="Cancel" defaultMessage="Cancel" description="Cancel button text in datepicker form" />
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
              <FormattedMessage id="Confirm" defaultMessage="Confirm" description="Confirm button text in datepicker form" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
