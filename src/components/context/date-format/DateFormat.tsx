import { CalendarDaysIcon, CheckIcon } from "lucide-react";
import React, { useState } from "react";

import { useUiText } from "@/components/context/i18n/useUiText";
import MenuOption from "@/components/context/MenuOption";
import { usePreferences } from "@/components/context/preferences/PreferencesContext";
import { Text } from "@/components/typography/Text";
import { AppIcon } from "@/components/ui/app-icon";
import { Drawer, DrawerContent, DrawerDescription, DrawerScrollArea, DrawerTopBar, DrawerTrigger } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { isDateFormatSetting } from "@/constants/dateFormatPatterns";
import { DATE_FORMAT_AUTO, DATE_FORMAT_EXAMPLES, DATE_FORMAT_OPTIONS, type DateFormatSetting } from "@/constants/dateFormats";
import type { UiMessages, UiT } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";

type DateFormatProps = {
  messages?: UiMessages;
  t?: UiT;
};

const DATE_FORMAT_SETTINGS: DateFormatSetting[] = [DATE_FORMAT_AUTO, ...DATE_FORMAT_OPTIONS];

function DateFormatOption({
  isActive,
  label,
  example,
  onSelect,
  tabIndex,
}: {
  isActive: boolean;
  label: string;
  example: string;
  onSelect: () => void;
  tabIndex: number;
}) {
  return (
    <div
      role="radio"
      aria-checked={isActive}
      tabIndex={tabIndex}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn("flex w-full items-center gap-3 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-brand-200")}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Text variant="titleSm" as="span" className="leading-6">
          {label}
        </Text>
        <Text variant="caption" as="span" className="text-text-200 leading-5">
          {example}
        </Text>
      </div>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center" aria-hidden="true">
        {isActive ? <AppIcon icon={CheckIcon} className="text-text-300" size="lg" /> : null}
      </span>
    </div>
  );
}

export default function DateFormat({ messages, t }: DateFormatProps) {
  const uiText = useUiText();
  const { dateFormat, dateFormatSetting, setDateFormat } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (value: DateFormatSetting) => {
    if (isDateFormatSetting(value)) {
      setDateFormat(value);
      setIsOpen(false);
    }
  };

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
      <DrawerTrigger className="!bg-transparent outline-none focus-visible:outline-none">
        <MenuOption
          icon={<AppIcon icon={CalendarDaysIcon} className="text-text-300" size="lg" />}
          label={uiText({ key: "ui.dateFormat.menuLabel", legacyKey: "settings.menu.dateFormat", messages, t })}
          defaultValue={DATE_FORMAT_EXAMPLES[dateFormat]}
        />
      </DrawerTrigger>

      <DrawerContent className="max-w-[430px] bg-elevation-50 mx-auto" innerClassName="flex flex-col gap-6 px-5 pt-4 pb-8">
        <DrawerTopBar
          title={uiText({ key: "ui.dateFormat.title", legacyKey: "settings.dateFormat.title", messages, t })}
          messages={messages}
          t={t}
        />
        <DrawerDescription className="sr-only">
          {uiText({ key: "ui.dateFormat.description", legacyKey: "settings.dateFormat.description", messages, t })}
        </DrawerDescription>

        <DrawerScrollArea
          className="flex-1"
          viewportClassName="flex max-h-[65vh] flex-col gap-6 overflow-y-auto pr-1 pb-10"
          role="group"
          aria-label={uiText({ key: "ui.dateFormat.title", messages, t })}
        >
          <div
            role="radiogroup"
            aria-label={uiText({ key: "ui.dateFormat.radioLabel", messages, t })}
            tabIndex={0}
            onKeyDown={handleKeyDownGroup}
            className="flex flex-col gap-2 pb-2"
          >
            {DATE_FORMAT_SETTINGS.map((setting, idx) => {
              const isAuto = setting === DATE_FORMAT_AUTO;
              const isActive = dateFormatSetting === setting;

              return (
                <React.Fragment key={setting}>
                  <DateFormatOption
                    isActive={isActive}
                    // "Automatic" shows what the device locale currently resolves to; the
                    // explicit patterns lead with their rendering and label the pattern.
                    label={isAuto ? uiText({ key: "ui.dateFormat.automatic", messages, t }) : DATE_FORMAT_EXAMPLES[setting]}
                    example={isAuto ? DATE_FORMAT_EXAMPLES[dateFormat] : setting.toLowerCase()}
                    onSelect={() => {
                      handleChange(setting);
                    }}
                    tabIndex={isActive ? 0 : -1}
                  />
                  {idx < DATE_FORMAT_SETTINGS.length - 1 && <Separator className="bg-divider-50" />}
                </React.Fragment>
              );
            })}
          </div>
        </DrawerScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
