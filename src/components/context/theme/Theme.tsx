import type { LucideIcon } from "lucide-react";
import { MoonIcon, SettingsIcon, SunIcon } from "lucide-react";

import { useUiText } from "@/components/context/i18n/useUiText";
import { Text } from "@/components/typography/Text";
import { AppIcon } from "@/components/ui/app-icon";
import { Drawer, DrawerContent, DrawerDescription, DrawerTopBar, DrawerTrigger } from "@/components/ui/drawer";
import { useTheme } from "@/hooks/use-theme";
import type { UiMessages, UiT, UiTranslationKey } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";

import MenuOption from "../MenuOption";
import type { Theme as ThemeValue } from "../preferences/PreferencesContext";

type ThemeProps = {
  messages?: UiMessages;
  t?: UiT;
};

type ThemeOption = {
  value: ThemeValue;
  icon: LucideIcon;
  labelKey: UiTranslationKey;
  legacyKey: string;
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: "system", icon: SettingsIcon, labelKey: "ui.theme.system", legacyKey: "settings.theme.system" },
  { value: "light", icon: SunIcon, labelKey: "ui.theme.light", legacyKey: "settings.theme.light" },
  { value: "dark", icon: MoonIcon, labelKey: "ui.theme.dark", legacyKey: "settings.theme.dark" },
];

export default function Theme({ messages, t }: ThemeProps) {
  const uiText = useUiText();
  const { setTheme, theme } = useTheme();
  const activeOption = THEME_OPTIONS.find((option) => option.value === theme) ?? THEME_OPTIONS[0];
  const themeLabel = uiText({ key: activeOption.labelKey, legacyKey: activeOption.legacyKey, messages, t });

  return (
    <Drawer>
      <DrawerTrigger className="!bg-transparent outline-none focus-visible:outline-none">
        <MenuOption
          icon={<AppIcon icon={SunIcon} className="text-text-300" size="lg" />}
          label={uiText({ key: "ui.theme.menuLabel", legacyKey: "settings.theme", messages, t })}
          defaultValue={themeLabel}
        />
      </DrawerTrigger>

      <DrawerContent className="max-w-[430px] bg-elevation-50 mx-auto" innerClassName="flex flex-col gap-6 px-5 pt-4 pb-8">
        <DrawerTopBar title={uiText({ key: "ui.theme.title", legacyKey: "settings.theme.title", messages, t })} messages={messages} t={t} />
        <DrawerDescription className="sr-only">
          {uiText({ key: "ui.theme.description", legacyKey: "settings.theme.description", messages, t })}
        </DrawerDescription>

        <div role="radiogroup" aria-label={uiText({ key: "ui.theme.radioLabel", messages, t })} className="flex w-full items-center gap-3">
          {THEME_OPTIONS.map((option) => {
            const isActive = option.value === theme;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => {
                  setTheme(option.value);
                }}
                className={cn(
                  "flex h-[104px] min-w-0 flex-1 flex-col items-start justify-end gap-10 rounded-xl border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand-200",
                  isActive ? "border-text-300" : "border-divider-75"
                )}
              >
                <AppIcon icon={option.icon} className="text-text-300" size="lg" />
                <Text variant="caption" as="span" className="block w-full truncate leading-5">
                  {uiText({ key: option.labelKey, legacyKey: option.legacyKey, messages, t })}
                </Text>
              </button>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
