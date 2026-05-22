import { ChevronDown, ChevronUp, EarthIcon, XIcon } from "lucide-react";
import React from "react";

import { AppIcon } from "@/components/ui/app-icon";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = Omit<ButtonProps, "children"> & {
  label: string;
  hasValue: boolean;
  selectedName: string;
  isRequired?: boolean;
  isOpen: boolean;
  clearAriaLabel: string;
  onClear: () => void;
  hasError?: boolean;
};

const CountrySelectorTrigger = React.forwardRef<HTMLButtonElement, Props>(function CountrySelectorTrigger(
  { label, hasValue, selectedName, isRequired, isOpen, clearAriaLabel, onClear, hasError, className, ...buttonProps },
  ref
) {
  return (
    <div className="rounded-lg border relative" style={{ borderColor: hasError ? "var(--color-signal-error)" : "var(--color-divider-50)" }}>
      <Button
        ref={ref}
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        aria-required={isRequired}
        className={cn(
          "flex h-[58px] w-full items-center justify-between rounded-lg !border-0 !bg-elevation-200 px-4 text-sm transition-all duration-200 ease-in-out outline-hidden !box-border focus:!ring-0 focus-visible:!ring-0",
          className
        )}
        {...buttonProps}
      >
        <div className="mr-2">
          <AppIcon icon={EarthIcon} className="text-text-300" size="md" />
        </div>

        <div className="flex-1 h-full flex flex-col justify-center text-left transition-all duration-200 ease-out">
          <label
            className={cn(
              "transition-all duration-200 ease-in-out",
              hasValue ? "text-text-200 text-xs font-normal" : "text-text-300 text-sm font-medium"
            )}
          >
            {label}
            {isRequired && (
              <span className={cn("ml-0", hasValue ? "text-text-200" : "text-signal-error")} aria-hidden="true">
                *
              </span>
            )}
          </label>
          {hasValue && <div className="text-text-300 text-sm font-medium">{selectedName}</div>}
        </div>

        <div className="flex items-center justify-center h-full">
          {hasValue && (
            <div aria-hidden="true" className="pointer-events-none mr-2 flex items-center justify-center rounded-sm text-text-300">
              <AppIcon icon={XIcon} className="opacity-0" />
            </div>
          )}
          {isOpen ? (
            <AppIcon icon={ChevronUp} className="text-text-300 w-6" />
          ) : (
            <AppIcon icon={ChevronDown} className="text-text-300 w-6" />
          )}
        </div>
      </Button>

      {hasValue && (
        <button
          type="button"
          aria-label={clearAriaLabel}
          className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-sm bg-transparent text-text-300"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              e.preventDefault();
              onClear();
            }
          }}
        >
          <AppIcon icon={XIcon} className="text-text-300" />
        </button>
      )}
    </div>
  );
});

export { CountrySelectorTrigger };
