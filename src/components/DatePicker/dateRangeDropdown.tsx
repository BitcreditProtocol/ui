import { CircleX } from "lucide-react";
import { useUiText } from "@/components/context/i18n/UiI18nProvider";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UiMessages, UiT } from "@/lib/ui-i18n";

interface DateRangeDropdownProps {
  value?: number;
  onRangeChange: (range: number) => void;
  onClear?: () => void;
  t?: UiT;
  messages?: UiMessages;
  clearPresetRangeLabel?: string;
}

export function DateRangeDropdown({ value, onRangeChange, onClear, t, messages, clearPresetRangeLabel }: DateRangeDropdownProps) {
  const uiText = useUiText();

  const handleRangeChanged = (value: string) => {
    const range = Number(value);
    onRangeChange(range);
  };

  const handleDisplayRange = (value: number | undefined): string => {
    switch (value) {
      case 30:
      case 60:
      case 90:
        return uiText({
          key: "ui.dateRangeDropdown.option.days",
          legacyKey: "displayRange.days",
          params: { value },
          messages,
          t,
        });
      case 180:
        return uiText({
          key: "ui.dateRangeDropdown.option.sixMonths",
          legacyKey: "displayRange.sixMonths",
          messages,
          t,
        });
      case 365:
        return uiText({
          key: "ui.dateRangeDropdown.option.oneYear",
          legacyKey: "displayRange.oneYear",
          messages,
          t,
        });
      case undefined:
      default:
        return uiText({
          key: "ui.dateRangeDropdown.option.selectRange",
          legacyKey: "displayRange.selectRange",
          messages,
          t,
        });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full rounded-lg bg-elevation-200 justify-between py-3 px-4 flex items-center">
          <span>{handleDisplayRange(value)}</span>
          {value !== undefined && (
            <div
              role="button"
              tabIndex={0}
              aria-label={
                clearPresetRangeLabel ??
                uiText({
                  key: "ui.dateRangeDropdown.clearPresetRange",
                  messages,
                  t,
                })
              }
              aria-pressed="false"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClear?.();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  onClear?.();
                } else if (e.key === "Escape") {
                  e.stopPropagation();
                }
              }}
              className="p-1 rounded-sm hover:bg-elevation-250 focus:outline-hidden focus:ring-2 focus:ring-brand-200 focus:ring-offset-1 cursor-pointer transition-colors"
            >
              <AppIcon icon={CircleX} className="text-text-300" size="md" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-elevation-200">
        <DropdownMenuLabel>
          {uiText({
            key: "ui.dateRangeDropdown.title",
            messages,
            t,
          })}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={String(value)} onValueChange={handleRangeChanged}>
          <DropdownMenuRadioItem value="30">
            {uiText({
              key: "ui.dateRangeDropdown.option.days",
              legacyKey: "dropdown.option.30days",
              params: { value: 30 },
              messages,
              t,
            })}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="60">
            {uiText({
              key: "ui.dateRangeDropdown.option.days",
              legacyKey: "dropdown.option.60days",
              params: { value: 60 },
              messages,
              t,
            })}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="90">
            {uiText({
              key: "ui.dateRangeDropdown.option.days",
              legacyKey: "dropdown.option.90days",
              params: { value: 90 },
              messages,
              t,
            })}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="180">
            {uiText({
              key: "ui.dateRangeDropdown.option.sixMonths",
              legacyKey: "dropdown.option.6months",
              messages,
              t,
            })}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="365">
            {uiText({
              key: "ui.dateRangeDropdown.option.oneYear",
              legacyKey: "dropdown.option.1year",
              messages,
              t,
            })}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
