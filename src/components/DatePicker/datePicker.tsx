import { ArrowRight, CalendarIcon } from "lucide-react";
import React, { useCallback, useRef } from "react";
import { useUiText } from "@/components/context/i18n/useUiText";
import { useLanguage } from "@/components/context/language/LanguageContext";
import { Calendar } from "@/components/DatePicker/calendar";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UiMessages, UiT } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";
import { addDays, type DateRange, type Matcher } from "@/utils/dates";
import { applyTimeToDate, cloneRange, formatDisplayDate, formatDisplayDateTime } from "./datePickerUtils";
import { DateRangeDropdown } from "./dateRangeDropdown";
import { MonthPicker } from "./monthPicker";
import { TimeInput } from "./TimeInput";
import { useDatePickerState } from "./useDatePickerState";
import { useDatePickerVisibility } from "./useDatePickerVisibility";
import { YearPicker } from "./yearPicker";

export interface DatePickerProps {
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
  const lastFooterTouchAtRef = useRef(0);

  const formatDate = withTime
    ? (date: Date | undefined, locale: string) => formatDisplayDateTime(date, locale, timeFormat)
    : formatDisplayDate;

  const {
    showCalendar,
    isClosing,
    showYearPicker,
    setShowYearPicker,
    showMonthPicker,
    setShowMonthPicker,
    openCalendar,
    openYearPicker,
    closePicker,
  } = useDatePickerVisibility();

  const {
    current,
    setCurrent,
    draft,
    setDraft,
    rangeFocus,
    setRangeFocus,
    selectedRange,
    setSelectedRange,
    setHasBeenCleared,
    allowRangeSelection,
    baseDate,
    calendarMonth,
    displayedSingleDate,
    canSelect,
    calendarModifiers,
    calendarModifiersClassNames,
    handleCalendarSelect,
    handleCalendarMonthChange,
  } = useDatePickerState({
    mode,
    value,
    disabled,
    isAutoSelectDisabled,
    showCalendar,
    showYearPicker,
    showMonthPicker,
  });

  const toggleCalendar = useCallback(() => {
    if (showCalendar) {
      setShowYearPicker(false);
      setShowMonthPicker(false);
      closePicker();
    } else {
      setDraft(cloneRange(current));
      openCalendar();
    }
  }, [showCalendar, current, setDraft, openCalendar, closePicker, setShowYearPicker, setShowMonthPicker]);

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

  const handleCancel = useCallback(() => {
    closePicker();
  }, [closePicker]);

  const handleConfirm = useCallback(() => {
    const nextRange = cloneRange(draft);
    setCurrent(nextRange);
    onChange(nextRange);
    closePicker();
  }, [draft, onChange, closePicker, setCurrent]);

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
            <div className={cn("sm:flex-1", !withTime && "w-full")}>
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
                      <span className="hidden sm:block text-xs text-text-200">
                        {uiText({ key: "ui.datePicker.time.from", messages, t })}
                      </span>
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
                      <span className="hidden sm:block text-xs text-text-200">{uiText({ key: "ui.datePicker.time.to", messages, t })}</span>
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
