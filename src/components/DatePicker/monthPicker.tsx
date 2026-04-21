import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

import { useLanguage } from "@/components/context/language/LanguageContext";
import { AppIcon } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";
import { formatMonthLong, formatMonthYear } from "@/utils/dates";

import { buttonVariants } from "../ui/button";

interface MonthPickerProps {
  value: Date;
  onChange: (date: Date) => void;
  onCaptionLabelClicked: () => void;
  shouldDisableFutureNavigation?: boolean;
}

const MonthPicker = ({ value, onChange, onCaptionLabelClicked, shouldDisableFutureNavigation = false }: MonthPickerProps) => {
  const lang = useLanguage();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const [base, setBase] = useState<Date>(() => {
    const initYear = shouldDisableFutureNavigation ? Math.min(value.getFullYear(), currentYear) : value.getFullYear();
    return new Date(initYear, value.getMonth(), 1);
  });

  useEffect(() => {
    const nextYear = shouldDisableFutureNavigation ? Math.min(value.getFullYear(), currentYear) : value.getFullYear();
    const nextMonth = value.getMonth();
    if (nextYear !== base.getFullYear() || nextMonth !== base.getMonth()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBase(() => new Date(nextYear, nextMonth, 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, shouldDisableFutureNavigation, currentYear]);

  const handleOnChange = (monthIndex: number) => {
    const newDate = new Date(base);
    newDate.setMonth(monthIndex);
    onChange(newDate);
  };

  const addYears = (years: number) => {
    setBase((val) => new Date(val.getFullYear() + years, val.getMonth(), 1));
  };

  const canGoBackward = true;
  const canGoForward = !shouldDisableFutureNavigation || base.getFullYear() < currentYear;

  const nextYear = () => {
    if (!canGoForward) {
      return;
    }
    addYears(1);
  };

  const prevYear = () => {
    addYears(-1);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={prevYear}
          aria-label="Previous year"
          disabled={!canGoBackward}
          className={cn("mx-1 bg-transparent p-0 border-0", {
            "cursor-pointer": canGoBackward,
            "opacity-30 pointer-events-none": !canGoBackward,
          })}
        >
          <AppIcon icon={ChevronLeft} />
        </button>
        <button
          type="button"
          onClick={onCaptionLabelClicked}
          className="flex justify-between items-center gap-2 cursor-pointer bg-transparent border-0 p-0"
        >
          {formatMonthYear(base, lang.locale)}
          <AppIcon icon={ChevronUp} strokeWidth={3} size={15} />
        </button>
        <button
          type="button"
          onClick={nextYear}
          aria-label="Next year"
          disabled={!canGoForward}
          className={cn("mx-1 bg-transparent p-0 border-0", {
            "cursor-pointer": canGoForward,
            "opacity-30 pointer-events-none": !canGoForward,
          })}
        >
          <AppIcon icon={ChevronRight} />
        </button>
      </div>
      <div className="grid grid-rows-4 grid-cols-3">
        {Array.from({ length: 12 }, (_, index) => {
          const date = new Date(base.getFullYear(), index, 1);
          const isFutureMonth =
            shouldDisableFutureNavigation &&
            (date.getFullYear() > currentYear || (date.getFullYear() === currentYear && index > currentMonth));
          const isSelected = date.getFullYear() === value.getFullYear() && date.getMonth() === value.getMonth();

          return (
            <button
              key={index}
              type="button"
              disabled={isFutureMonth}
              onClick={() => {
                if (!isFutureMonth) handleOnChange(index);
              }}
              className={cn("h-[42px] flex justify-center items-center", buttonVariants({ variant: "ghost" }), {
                "cursor-pointer": !isFutureMonth,
                "opacity-40 text-text-200 pointer-events-none": isFutureMonth,
                "bg-elevation-200 hover:bg-elevation-200 border border-divider-100": isSelected,
              })}
            >
              {formatMonthLong(date, lang.locale)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { MonthPicker };
