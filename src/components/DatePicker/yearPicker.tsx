import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import React, { useRef, useState } from "react";

import { useLanguage } from "@/components/context/language/LanguageContext";
import { AppIcon } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";
import { formatYearNumeric } from "@/utils/dates";

import { buttonVariants } from "../ui/button";

interface YearPickerProps {
  value: Date;
  onChange: (date: Date) => void;
  onCaptionLabelClicked: () => void;
  numberYears?: number;
  shouldDisableFutureNavigation?: boolean;
  currentYearPosition?: "start" | "center" | "end";
  order?: "asc" | "desc";
}

const YearPicker = ({
  value,
  onChange,
  onCaptionLabelClicked,
  numberYears = 21,
  shouldDisableFutureNavigation = false,
  currentYearPosition = "start",
  order = "asc",
}: YearPickerProps) => {
  const lang = useLanguage();
  const currentYear = new Date().getFullYear();
  const total = numberYears;
  const half = Math.floor(total / 2);
  const positionIndex = currentYearPosition === "center" ? half : currentYearPosition === "end" ? total - 1 : 0;
  const maxBaseYear = currentYear - (total - 1 - positionIndex);

  const [baseYear, setBaseYear] = useState(() => {
    return shouldDisableFutureNavigation ? Math.min(value.getFullYear(), maxBaseYear) : value.getFullYear();
  });

  const handleOnChange = (year: number) => {
    const updateDate = new Date(value);
    updateDate.setFullYear(year);
    onChange(updateDate);
  };

  const startYearAdjusted = baseYear - positionIndex;
  const endYear = startYearAdjusted + total - 1;

  const canGoForward = !shouldDisableFutureNavigation || endYear < currentYear;

  const nextYears = () => {
    if (canGoForward) {
      const target = baseYear + numberYears;
      const clamped = shouldDisableFutureNavigation ? Math.min(target, maxBaseYear) : target;
      setBaseYear(clamped);
    }
  };
  const prevYears = () => {
    setBaseYear(baseYear - numberYears);
  };

  const touchStartXRef = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;

    if (diffX > 50) {
      prevYears();
    } else if (diffX < -50) {
      nextYears();
    }

    touchStartXRef.current = null;
  };
  const years = Array.from({ length: numberYears }, (_, i) => startYearAdjusted + i);
  const displayYears = order === "desc" ? [...years].reverse() : years;

  return (
    <div className="flex flex-col gap-2" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ touchAction: "pan-y" }}>
      <div className="flex justify-between items-center">
        <button type="button" onClick={prevYears} aria-label="Previous years" className="mx-1 cursor-pointer bg-transparent p-0 border-0">
          <AppIcon icon={ChevronLeft} />
        </button>
        <button
          type="button"
          onClick={onCaptionLabelClicked}
          className="flex justify-between items-center gap-2 cursor-pointer bg-transparent border-0 p-0"
        >
          {formatYearNumeric(value, lang.locale)}
          <AppIcon icon={ChevronUp} strokeWidth={3} size={15} />
        </button>
        <button
          type="button"
          onClick={nextYears}
          aria-label="Next years"
          disabled={!canGoForward}
          className={cn("mx-1 bg-transparent p-0 border-0", {
            "cursor-pointer": canGoForward,
            "opacity-30 pointer-events-none": !canGoForward,
          })}
        >
          <AppIcon icon={ChevronRight} />
        </button>
      </div>
      <div className="grid grid-rows-7 grid-cols-3">
        {displayYears.map((year) => {
          const isSelected = year === value.getFullYear();
          const isDisabled = shouldDisableFutureNavigation && year > currentYear;

          return (
            <button
              key={year}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) handleOnChange(year);
              }}
              className={cn("h-[42px] flex justify-center items-center", buttonVariants({ variant: "ghost" }), {
                "cursor-pointer": !isDisabled,
                "bg-elevation-200 hover:bg-elevation-200 border border-divider-100": isSelected,
                "opacity-40 text-text-200 pointer-events-none": isDisabled,
              })}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { YearPicker };
