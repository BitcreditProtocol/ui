import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { ScrollColumn } from "./ScrollColumn";
import { AM_PM, HOURS_12, HOURS_24, ITEM_H, MINUTES_LIST, VISIBLE_COUNT } from "./scrollColumnConstants";

export interface TimeInputProps {
  value?: Date;
  format?: "12h" | "24h";
  disabled?: boolean;
  onChange: (timeStr: string) => void;
  className?: string;
}

export function TimeInput({ value, format = "24h", disabled, onChange, className }: TimeInputProps) {
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
