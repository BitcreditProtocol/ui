import { AlignVerticalJustifyCenterIcon, CheckIcon } from "lucide-react";
import React, { type PropsWithChildren, useCallback, useState } from "react";

import { useUiText } from "@/components/context/i18n/UiI18nProvider";
import { Text } from "@/components/typography/Text";
import { AppIcon } from "@/components/ui/app-icon";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import type { UiMessages, UiT } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";
import MenuOption from "../MenuOption";
import { type DecimalFormat, usePreferences } from "../preferences/PreferencesContext";

type DecimalSeparatorProps = PropsWithChildren<{
  value: DecimalFormat;
  onChange: (value: DecimalFormat) => void;
  messages?: UiMessages;
  t?: UiT;
}>;

interface DecimalFormatDef {
  value: DecimalFormat;
  labelKey: "ui.decimalSeparator.point" | "ui.decimalSeparator.comma" | "ui.decimalSeparator.space";
  legacyKey: string;
  example: string;
}

const DECIMAL_FORMATS: DecimalFormatDef[] = [
  {
    value: "point",
    labelKey: "ui.decimalSeparator.point",
    legacyKey: "settings.decimalFormat.point",
    example: "1.000,00",
  },
  {
    value: "comma",
    labelKey: "ui.decimalSeparator.comma",
    legacyKey: "settings.decimalFormat.comma",
    example: "1,000.00",
  },
  {
    value: "space",
    labelKey: "ui.decimalSeparator.space",
    legacyKey: "settings.decimalFormat.space",
    example: "1 000,00",
  },
];

function DecimalFormatOption({
  def,
  isActive,
  onSelect,
  index,
  hasActiveVisible,
  messages,
  t,
}: {
  def: DecimalFormatDef;
  isActive: boolean;
  onSelect: (value: DecimalFormat) => void;
  index: number;
  hasActiveVisible: boolean;
  messages?: UiMessages;
  t?: UiT;
}) {
  const uiText = useUiText();
  const tabIndex = isActive ? 0 : !hasActiveVisible && index === 0 ? 0 : -1;
  return (
    <div
      role="radio"
      aria-checked={isActive}
      tabIndex={tabIndex}
      onClick={() => {
        onSelect(def.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(def.value);
        }
      }}
      className={cn("flex items-center justify-between cursor-pointer rounded-md px-2 py-3 outline-none focus:ring-2 focus:ring-brand-200")}
    >
      <div className="flex flex-col gap-0.5">
        <Text variant="titleSm" as="span">
          {uiText({ key: def.labelKey, legacyKey: def.legacyKey, messages, t })}
        </Text>
        <Text variant="caption" as="span">
          {def.example}
        </Text>
      </div>
      <span className="flex h-5 w-5 items-center justify-center" aria-hidden="true">
        {isActive ? <AppIcon icon={CheckIcon} className="text-text-300 stroke-[1.75]" size="md" /> : null}
      </span>
    </div>
  );
}

export default function DecimalSeparator({ children, onChange, value, messages, t }: DecimalSeparatorProps) {
  const uiText = useUiText();
  const [isOpen, setIsOpen] = useState(false);

  const _onChange = useCallback(
    (format: DecimalFormat) => {
      onChange(format);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleKeyDownGroup = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(e.currentTarget.querySelectorAll('[role="radio"]'));
    const currentIndex = items.findIndex((el) => el.getAttribute("aria-checked") === "true");
    const focusElement = (el: Element | undefined) => {
      if (el && el instanceof HTMLElement) {
        el.focus();
      }
    };

    if ((e.key === "ArrowDown" || e.key === "ArrowRight") && items.length) {
      e.preventDefault();
      const targetIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
      focusElement(items[targetIndex]);
    } else if ((e.key === "ArrowUp" || e.key === "ArrowLeft") && items.length) {
      e.preventDefault();
      const targetIndex = currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
      focusElement(items[targetIndex]);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="!bg-transparent outline-none focus-visible:outline-none">{children}</DrawerTrigger>

      <DrawerContent className="max-w-[430px] bg-elevation-50 py-4 px-5 mx-auto">
        <DrawerTitle className="text-text-300 text-left text-lg font-medium leading-[28px] mb-3">
          {uiText({ key: "ui.decimalSeparator.title", legacyKey: "settings.decimalSeparator.title", messages, t })}
        </DrawerTitle>
        <DrawerDescription className="sr-only">
          {uiText({ key: "ui.decimalSeparator.description", legacyKey: "settings.decimalSeparator.description", messages, t })}
        </DrawerDescription>

        <div className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1" role="group" aria-label={uiText({ key: "ui.decimalSeparator.title", messages, t })}>
          <div
            role="radiogroup"
            aria-label={uiText({ key: "ui.decimalSeparator.radioLabel", messages, t })}
            tabIndex={0}
            onKeyDown={handleKeyDownGroup}
            className="flex flex-col gap-3 pb-2"
          >
            {(() => {
              const hasActiveVisible = DECIMAL_FORMATS.some((f) => f.value === value);

              return DECIMAL_FORMATS.map((def, idx) => (
                <React.Fragment key={def.value}>
                  <DecimalFormatOption
                    def={def}
                    isActive={value === def.value}
                    onSelect={_onChange}
                    index={idx}
                    hasActiveVisible={hasActiveVisible}
                    messages={messages}
                    t={t}
                  />
                  {idx < DECIMAL_FORMATS.length - 1 && <Separator key={`${def.value}-sep`} className="bg-divider-75" />}
                </React.Fragment>
              ));
            })()}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function DecimalSeparatorSetting() {
  const uiText = useUiText();
  const { decimalFormat, setDecimalFormat } = usePreferences();

  const getDisplayValue = (format: DecimalFormat): string => {
    const def = DECIMAL_FORMATS.find((f) => f.value === format);
    return def?.example || "1,000.00";
  };

  return (
    <DecimalSeparator value={decimalFormat} onChange={setDecimalFormat}>
      <MenuOption
        icon={<AppIcon icon={AlignVerticalJustifyCenterIcon} className="text-text-300" size="lg" />}
        label={uiText({ key: "ui.decimalSeparator.menuLabel", legacyKey: "settings.menu.decimals" })}
        defaultValue={getDisplayValue(decimalFormat)}
      />
    </DecimalSeparator>
  );
}
