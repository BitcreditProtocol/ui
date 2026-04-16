import { MoonIcon, SettingsIcon, SunIcon } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { AppIcon } from "@/components/ui/app-icon";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

import MenuOption from "../MenuOption";

export default function Theme() {
  const intl = useIntl();
  const { setTheme, theme } = useTheme();
  const themeLabel =
    theme === "system"
      ? intl.formatMessage({
          id: "settings.theme.system",
          defaultMessage: "System",
        })
      : theme === "light"
        ? intl.formatMessage({
            id: "settings.theme.light",
            defaultMessage: "Light",
          })
        : intl.formatMessage({
            id: "settings.theme.dark",
            defaultMessage: "Dark",
          });

  return (
    <Drawer>
      <DrawerTrigger className="!bg-transparent outline-none focus-visible:outline-none">
        <MenuOption
          icon={<AppIcon icon={SunIcon} className="text-text-300" size="lg" />}
          label={intl.formatMessage({
            id: "settings.theme",
            defaultMessage: "Theme",
          })}
          defaultValue={themeLabel}
        />
      </DrawerTrigger>

      <DrawerContent className="gap-3 max-w-[430px] py-4 px-5 bg-elevation-50 mx-auto">
        <DrawerTitle className="text-text-300 text-lg font-medium leading-[28px]">
          <FormattedMessage id="settings.theme.title" defaultMessage="Theme" description="Theme settings title" />
        </DrawerTitle>
        <DrawerDescription className="sr-only">
          <FormattedMessage
            id="settings.theme.description"
            defaultMessage="Select your preferred theme mode"
            description="Theme settings description for screen readers"
          />
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
              <FormattedMessage id="settings.theme.system" defaultMessage="System" description="System theme" />
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
              <FormattedMessage id="settings.theme.light" defaultMessage="Light" description="Light theme" />
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
              <FormattedMessage id="settings.theme.dark" defaultMessage="Dark" description="Dark theme" />
            </span>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
