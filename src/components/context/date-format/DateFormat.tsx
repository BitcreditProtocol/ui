import { CalendarDaysIcon } from "lucide-react";
import { useState } from "react";

import { useUiText } from "@/components/context/i18n/useUiText";
import MenuOption from "@/components/context/MenuOption";
import { usePreferences } from "@/components/context/preferences/PreferencesContext";
import { Text } from "@/components/typography/Text";
import { AppIcon } from "@/components/ui/app-icon";
import { Drawer, DrawerContent, DrawerDescription, DrawerScrollArea, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { isDateFormatPattern } from "@/constants/dateFormatPatterns";
import { DATE_FORMAT_EXAMPLES, DATE_FORMAT_OPTIONS } from "@/constants/dateFormats";
import type { UiMessages, UiT } from "@/lib/ui-i18n";

type DateFormatProps = {
  messages?: UiMessages;
  t?: UiT;
};

export default function DateFormat({ messages, t }: DateFormatProps) {
  const uiText = useUiText();
  const { dateFormat, setDateFormat } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (value: string) => {
    if (isDateFormatPattern(value)) {
      setDateFormat(value);
      setIsOpen(false);
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

      <DrawerContent className="max-w-[430px] bg-elevation-50 py-4 px-5 mx-auto">
        <DrawerTitle className="text-text-300 text-left text-lg font-medium leading-[28px] mb-3">
          {uiText({ key: "ui.dateFormat.title", legacyKey: "settings.dateFormat.title", messages, t })}
        </DrawerTitle>
        <DrawerDescription className="sr-only">
          {uiText({ key: "ui.dateFormat.description", legacyKey: "settings.dateFormat.description", messages, t })}
        </DrawerDescription>

        <DrawerScrollArea
          className="flex-1"
          viewportClassName="flex max-h-[65vh] flex-col gap-3 overflow-y-auto pr-1 pb-10"
          role="group"
          aria-label={uiText({ key: "ui.dateFormat.title", messages, t })}
        >
          <RadioGroup
            value={dateFormat}
            onValueChange={handleChange}
            aria-label={uiText({ key: "ui.dateFormat.radioLabel", messages, t })}
            className="flex flex-col gap-2"
          >
            {DATE_FORMAT_OPTIONS.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center justify-between rounded-md px-2 py-3 outline-none focus-within:ring-2 focus-within:ring-brand-200"
              >
                <div className="flex flex-col gap-0.5">
                  <Text variant="titleSm" as="span">
                    {option}
                  </Text>
                  <Text variant="caption" as="span">
                    {DATE_FORMAT_EXAMPLES[option]}
                  </Text>
                </div>
                <RadioGroupItem value={option} aria-label={option} />
              </label>
            ))}
          </RadioGroup>
        </DrawerScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
