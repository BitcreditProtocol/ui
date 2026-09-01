import { CheckIcon } from "lucide-react";
import React, { type PropsWithChildren, useCallback, useMemo, useRef, useState } from "react";

import { useUiText } from "@/components/context/i18n/useUiText";
import { Text } from "@/components/typography/Text";
import { AppIcon } from "@/components/ui/app-icon";
import { Drawer, DrawerContent, DrawerDescription, DrawerScrollArea, DrawerTopBar, DrawerTrigger } from "@/components/ui/drawer";
import { Search } from "@/components/ui/search";
import { Separator } from "@/components/ui/separator";
import type { UiMessages, UiT } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";
import { getLocaleFlagEmoji } from "@/utils/flagEmoji";

type LanguagePreferenceProps = PropsWithChildren<{
  value: string;
  values: string[];
  onChange: (value: string) => void;
  messages?: UiMessages;
  t?: UiT;
}>;

interface LanguageDef {
  locale: string;
  label: string;
  short?: string;
}

const ALL_LANGUAGES: LanguageDef[] = [
  { locale: "en-US", label: "American English", short: "en-US" },
  // { locale: "en-GB", label: "British English", short: "en-GB" },
  { locale: "es-ES", label: "Español (España)", short: "es-ES" },
  // { locale: "es-AR", label: "Español (Argentina)", short: "es-AR" },
  { locale: "de-DE", label: "Deutsch (Deutschland)", short: "de-DE" },
  // { locale: "de-AT", label: "Deutsch (Österreich)", short: "de-AT" },
  { locale: "it-IT", label: "Italiano", short: "it-IT" },
  { locale: "tr-TR", label: "Türkçe", short: "tr-TR" },
];

function LanguageOption({
  def,
  isActive,
  onSelect,
  index,
  hasActiveVisible,
}: {
  def: LanguageDef;
  isActive: boolean;
  onSelect: (locale: string) => void;
  index: number;
  hasActiveVisible: boolean;
}) {
  const tabIndex = isActive ? 0 : !hasActiveVisible && index === 0 ? 0 : -1;
  return (
    <div
      role="radio"
      aria-checked={isActive}
      tabIndex={tabIndex}
      onClick={() => {
        onSelect(def.locale);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(def.locale);
        }
      }}
      className={cn("flex w-full items-center gap-3 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-brand-200")}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg text-[28px] leading-[38px]"
        aria-hidden="true"
      >
        {getLocaleFlagEmoji(def.locale)}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Text variant="titleSm" as="span" className="leading-6">
          {def.label}
        </Text>
        <Text variant="caption" as="span" className="text-text-200 leading-5">
          {def.short ?? def.locale}
        </Text>
      </div>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center" aria-hidden="true">
        {isActive ? <AppIcon icon={CheckIcon} className="text-text-300" size="lg" /> : null}
      </span>
    </div>
  );
}

export default function LanguagePreference({ children, onChange, value, values, messages, t }: LanguagePreferenceProps) {
  const uiText = useUiText();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const normalizedSearch = useMemo(
    () =>
      searchTerm
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\s+/g, " ")
        .replace(/[\u0300-\u036f]/g, ""),
    [searchTerm]
  );
  const baseLanguages = useMemo(
    () => (values.length > 0 ? ALL_LANGUAGES.filter((l) => values.some((v) => l.locale.startsWith(v))) : ALL_LANGUAGES),
    [values]
  );
  const available = useMemo(() => {
    if (!normalizedSearch) return baseLanguages;
    return baseLanguages.filter((l) => {
      const targets = [l.label, l.locale, l.short ?? ""].map((t) =>
        t
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      );
      return targets.some((t) => t.includes(normalizedSearch));
    });
  }, [normalizedSearch, baseLanguages]);
  const isNoResults = normalizedSearch.length > 0 && available.length === 0;

  const _onChange = useCallback(
    (locale: string) => {
      onChange(locale);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleKeyDownGroup = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!listRef.current) {
      return;
    }

    const items = Array.from(listRef.current.querySelectorAll('[role="radio"]'));
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

      <DrawerContent className="max-w-[430px] bg-elevation-50 mx-auto" innerClassName="flex flex-col gap-6 px-5 pt-4 pb-8">
        <DrawerDescription className="sr-only">
          {uiText({ key: "ui.languagePreference.description", legacyKey: "settings.languagePreference.description", messages, t })}
        </DrawerDescription>
        <DrawerTopBar
          title={uiText({ key: "ui.languagePreference.title", legacyKey: "settings.languagePreference.title", messages, t })}
          messages={messages}
          t={t}
        />

        <DrawerScrollArea
          className="flex-1"
          viewportClassName="flex max-h-[65vh] flex-col gap-6 overflow-y-auto pr-1 pb-10"
          role="group"
          aria-label={uiText({ key: "ui.languagePreference.groupLabel", messages, t })}
        >
          <div ref={searchContainerRef} className="sticky top-0 z-10 bg-elevation-50 pt-0 dark:bg-elevation-250">
            <Search
              className={cn(
                "bg-elevation-50 hover:bg-elevation-250 focus:bg-elevation-250",
                "dark:bg-elevation-250 dark:hover:bg-elevation-50 dark:focus:bg-elevation-50"
              )}
              value={searchTerm}
              placeholder={uiText({
                key: "ui.languagePreference.searchPlaceholder",
                legacyKey: "language.search.placeholder",
                messages,
                t,
              })}
              onChange={(val) => {
                setSearchTerm(val);
              }}
              onSearch={(query) => {
                setSearchTerm(query);
              }}
              size="sm"
            />

            <div aria-live="polite" className="sr-only">
              {isNoResults
                ? uiText({ key: "ui.languagePreference.noResults", legacyKey: "language.search.no.results", messages, t })
                : uiText({
                    key: "ui.languagePreference.resultsCount",
                    legacyKey: "language.search.results.count",
                    params: { count: available.length },
                    messages,
                    t,
                  })}
            </div>
          </div>

          <div
            ref={listRef}
            role="radiogroup"
            aria-label={uiText({ key: "ui.languagePreference.ariaLabel", messages, t })}
            tabIndex={0}
            onKeyDown={handleKeyDownGroup}
            className="flex flex-col gap-2 pb-2"
          >
            {available.map((def, idx) => {
              const hasActiveVisible = available.some((l) => l.locale === value);
              return (
                <React.Fragment key={def.locale}>
                  <LanguageOption
                    def={def}
                    isActive={value === def.locale}
                    onSelect={_onChange}
                    index={idx}
                    hasActiveVisible={hasActiveVisible}
                  />
                  {idx < available.length - 1 && <Separator key={`${def.locale}-sep`} className="bg-divider-50" />}
                </React.Fragment>
              );
            })}
          </div>
        </DrawerScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
