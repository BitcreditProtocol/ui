import { AlignVerticalJustifyCenterIcon, CheckIcon } from "lucide-react";
import React, { type PropsWithChildren, useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Text } from "@/components/typography/Text";
import { AppIcon } from "@/components/ui/app-icon";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import MenuOption from "../MenuOption";
import { type DecimalFormat, usePreferences } from "../preferences/PreferencesContext";

type DecimalSeparatorProps = PropsWithChildren<{
  value: DecimalFormat;
  onChange: (value: DecimalFormat) => void;
}>;

interface DecimalFormatDef {
  value: DecimalFormat;
  labelKey: string;
  example: string;
}

const DECIMAL_FORMATS: DecimalFormatDef[] = [
  {
    value: "point",
    labelKey: "settings.decimalFormat.point",
    example: "1.000,00",
  },
  {
    value: "comma",
    labelKey: "settings.decimalFormat.comma",
    example: "1,000.00",
  },
  {
    value: "space",
    labelKey: "settings.decimalFormat.space",
    example: "1 000,00",
  },
];

function DecimalFormatOption({
  def,
  isActive,
  onSelect,
  index,
  hasActiveVisible,
}: {
  def: DecimalFormatDef;
  isActive: boolean;
  onSelect: (value: DecimalFormat) => void;
  index: number;
  hasActiveVisible: boolean;
}) {
  const intl = useIntl();
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
          {intl.formatMessage({
            id: def.labelKey,
            defaultMessage: def.value.charAt(0).toUpperCase() + def.value.slice(1),
          })}
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

export default function DecimalSeparator({ children, onChange, value }: DecimalSeparatorProps) {
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
      <DrawerTrigger className="bg-elevation-50 outline-none focus-visible:outline-none">{children}</DrawerTrigger>

      <DrawerContent className="max-w-[430px] bg-elevation-50 py-4 px-5 mx-auto">
        <DrawerTitle className="text-text-300 text-left text-lg font-medium leading-[28px] mb-3">
          <FormattedMessage id="settings.decimalSeparator.title" defaultMessage="Decimals" description="Decimal separator drawer title" />
        </DrawerTitle>
        <DrawerDescription className="sr-only">
          <FormattedMessage
            id="settings.decimalSeparator.description"
            defaultMessage="Select your preferred decimal and thousands separator format"
            description="Decimal separator description for screen readers"
          />
        </DrawerDescription>

        <div className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1" role="group" aria-label="Decimal separator selection area">
          <div
            role="radiogroup"
            aria-label="Select decimal separator format"
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
  const intl = useIntl();
  const { decimalFormat, setDecimalFormat } = usePreferences();

  const getDisplayValue = (format: DecimalFormat): string => {
    const def = DECIMAL_FORMATS.find((f) => f.value === format);
    return def?.example || "1,000.00";
  };

  return (
    <DecimalSeparator value={decimalFormat} onChange={setDecimalFormat}>
      <MenuOption
        icon={<AppIcon icon={AlignVerticalJustifyCenterIcon} className="text-text-300" size="lg" />}
        label={intl.formatMessage({
          id: "settings.menu.decimals",
          defaultMessage: "Decimals",
          description: "Decimals menu item",
        })}
        defaultValue={getDisplayValue(decimalFormat)}
      />
    </DecimalSeparator>
  );
}
