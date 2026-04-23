import { MoonIcon, SettingsIcon, SunIcon } from "lucide-react";

import { useUiText } from "@/components/context/i18n/UiI18nProvider";
import { AppIcon } from "@/components/ui/app-icon";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useTheme } from "@/hooks/use-theme";
import type { UiMessages, UiT } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";

import MenuOption from "../MenuOption";

type ThemeProps = {
  messages?: UiMessages;
  t?: UiT;
};

export default function Theme({ messages, t }: ThemeProps) {
  const uiText = useUiText();
  const { setTheme, theme } = useTheme();
  const themeLabel =
    theme === "system"
      ? uiText({ key: "ui.theme.system", legacyKey: "settings.theme.system", messages, t })
      : theme === "light"
        ? uiText({ key: "ui.theme.light", legacyKey: "settings.theme.light", messages, t })
        : uiText({ key: "ui.theme.dark", legacyKey: "settings.theme.dark", messages, t });

  return (
    <Drawer>
      <DrawerTrigger className="!bg-transparent outline-none focus-visible:outline-none">
        <MenuOption
          icon={<AppIcon icon={SunIcon} className="text-text-300" size="lg" />}
          label={uiText({ key: "ui.theme.menuLabel", legacyKey: "settings.theme", messages, t })}
          defaultValue={themeLabel}
        />
      </DrawerTrigger>

      <DrawerContent className="gap-3 max-w-[430px] py-4 px-5 bg-elevation-50 mx-auto">
        <DrawerTitle className="text-text-300 text-lg font-medium leading-[28px]">
          {uiText({ key: "ui.theme.title", legacyKey: "settings.theme.title", messages, t })}
        </DrawerTitle>
        <DrawerDescription className="sr-only">
          {uiText({ key: "ui.theme.description", legacyKey: "settings.theme.description", messages, t })}
        </DrawerDescription>

        <div className="flex items-center gap-3 max-w-[300px]">
          <div
            className={cn(
              "flex-1 min-w-0 flex flex-col gap-4 p-4 border border-text-200 rounded-xl cursor-pointer transition-all duration-150",
              {
                "bg-black text-white": theme === "system" && window.matchMedia("(prefers-color-scheme: light)").matches,
                "bg-white text-black": theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches,
              }
            )}
            onClick={() => {
              setTheme("system");
            }}
          >
            <AppIcon
              icon={SettingsIcon}
              className={cn("h-6 w-6 stroke-1", {
                "text-white": theme === "system" && window.matchMedia("(prefers-color-scheme: light)").matches,
                "text-black": theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches,
              })}
            />

            <span
              className={cn("block w-full truncate whitespace-nowrap text-sm font-normal leading-5", {
                "text-white": theme === "system" && window.matchMedia("(prefers-color-scheme: light)").matches,
                "text-black": theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches,
              })}
            >
              {uiText({ key: "ui.theme.system", legacyKey: "settings.theme.system", messages, t })}
            </span>
          </div>

          <div
            className={cn("flex-1 min-w-0 flex flex-col gap-4 p-4 border border-text-200 rounded-xl cursor-pointer", {
              "bg-black": theme === "light",
            })}
            onClick={() => {
              setTheme("light");
            }}
          >
            <AppIcon
              icon={SunIcon}
              className={cn("h-6 w-6 stroke-1", {
                "text-white": theme === "light",
              })}
            />

            <span
              className={cn("block w-full truncate whitespace-nowrap text-sm font-normal leading-5", {
                "text-white": theme === "light",
              })}
            >
              {uiText({ key: "ui.theme.light", legacyKey: "settings.theme.light", messages, t })}
            </span>
          </div>

          <div
            className={cn("flex-1 min-w-0 flex flex-col gap-4 p-4 border border-text-200 rounded-xl cursor-pointer", {
              "bg-white": theme === "dark",
            })}
            onClick={() => {
              setTheme("dark");
            }}
          >
            <AppIcon
              icon={MoonIcon}
              className={cn("h-6 w-6 stroke-1", {
                "text-black": theme === "dark",
              })}
            />

            <span
              className={cn("block w-full truncate whitespace-nowrap text-sm font-normal leading-5", {
                "text-black": theme === "dark",
              })}
            >
              {uiText({ key: "ui.theme.dark", legacyKey: "settings.theme.dark", messages, t })}
            </span>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
