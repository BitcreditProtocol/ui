import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";

import { useLanguage } from "@/components/context/language/LanguageContext";
import { AppIcon } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";
import {
  type DateRange,
  dateMatchModifiers,
  formatMonthYear,
  getMonthDays,
  getWeekdayLabels,
  isSameDay,
  type Matcher,
  startOfMonth,
} from "@/utils/dates";

export type CalendarSelectHandler = (
  range: DateRange | undefined,
  selectedDay: Date,
  modifiers: { disabled: boolean; selected: boolean },
  event: React.MouseEvent<HTMLButtonElement>
) => void;

export type CalendarProps = {
  className?: string;
  mode: "single" | "range";
  month?: Date;
  selected: DateRange;
  onSelect: CalendarSelectHandler;
  onCaptionLabelClicked: () => void;
  disabled?: Matcher | Matcher[];
  isFutureNavigationDisabled?: boolean;
  rangeFocus?: "from" | "to";
  modifiers?: Record<string, (date: Date) => boolean>;
  modifiersClassNames?: Record<string, string>;
  ISOWeek?: boolean;
};

export function Calendar({
  className,
  mode,
  month,
  selected,
  onSelect,
  onCaptionLabelClicked,
  disabled,
  isFutureNavigationDisabled = false,
  rangeFocus = "from",
  modifiers,
  modifiersClassNames,
  ISOWeek = true,
}: CalendarProps) {
  const { locale } = useLanguage();
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(month ?? selected.from ?? new Date()));

  const weekdayLabels = useMemo(() => getWeekdayLabels(locale, ISOWeek), [ISOWeek, locale]);
  const monthDays = useMemo(() => getMonthDays(visibleMonth, ISOWeek), [ISOWeek, visibleMonth]);
  const currentMonthStart = startOfMonth(new Date());
  const canGoForward = !isFutureNavigationDisabled || visibleMonth < currentMonthStart;

  const handleMonthShift = (offset: number) => {
    if (offset > 0 && !canGoForward) {
      return;
    }

    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const touchStartXRef = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;

    if (diffX > 50) {
      handleMonthShift(-1);
    } else if (diffX < -50) {
      handleMonthShift(1);
    }

    touchStartXRef.current = null;
  };

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      style={{ touchAction: "pan-y" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between">
        <button type="button" className="bg-transparent p-0" onClick={() => handleMonthShift(-1)} aria-label="Previous month">
          <AppIcon icon={ChevronLeft} />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 bg-transparent p-0 text-sm font-medium"
          onClick={onCaptionLabelClicked}
          aria-label="Open month and year picker"
        >
          <span>{formatMonthYear(visibleMonth, locale)}</span>
          <AppIcon icon={ChevronDown} strokeWidth={3} size={15} />
        </button>
        <button
          type="button"
          className={cn("bg-transparent p-0", !canGoForward && "pointer-events-none opacity-30")}
          onClick={() => handleMonthShift(1)}
          aria-label="Next month"
          disabled={!canGoForward}
        >
          <AppIcon icon={ChevronRight} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-200">
        {weekdayLabels.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((day) => {
          const isOutsideMonth = day.getMonth() !== visibleMonth.getMonth();
          const isDisabled = dateMatchModifiers(day, disabled);
          const isToday = isSameDay(day, new Date());
          const isSelectedStart = !!selected.from && isSameDay(day, selected.from);
          const isSelectedEnd = !!selected.to && isSameDay(day, selected.to);
          const isSelectedSingle = mode === "single" && !!selected.from && isSameDay(day, selected.from);
          const isRangeMiddle = !!selected.from && !!selected.to && day > selected.from && day < selected.to;
          const isSelected = isSelectedSingle || isSelectedStart || isSelectedEnd || isRangeMiddle;
          const customClassNames = Object.entries(modifiersClassNames ?? {})
            .filter(([modifierName]) => modifiers?.[modifierName]?.(day))
            .map(([, modifierClassName]) => modifierClassName)
            .join(" ");

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={(event) => {
                setVisibleMonth(startOfMonth(day));
                onSelect(undefined, day, { disabled: isDisabled, selected: isSelected }, event);
              }}
              className={cn(
                "w-10 h-10 rounded-xl border text-sm bg-elevation-200",
                "disabled:pointer-events-none disabled:opacity-40",
                isOutsideMonth ? "text-text-200/70" : "text-text-300",
                isToday && "border-divider-100 bg-elevation-200",
                isRangeMiddle && "rounded-lg border-transparent bg-brand-100/40",
                (isSelectedSingle || isSelectedStart || isSelectedEnd) && "border-divider-100 bg-elevation-200",
                rangeFocus === "from" && isSelectedStart && "ring-2 ring-brand-200",
                rangeFocus === "to" && isSelectedEnd && "ring-2 ring-brand-200",
                customClassNames
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
