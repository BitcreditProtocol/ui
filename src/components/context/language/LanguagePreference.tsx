import { CheckIcon } from "lucide-react";
import React, { type PropsWithChildren, useCallback, useMemo, useRef, useState } from "react";
// import ArFlag from "@/components/assets/flags/AR.svg";
// import AtFlag from "@/components/assets/flags/AT.svg";
import GerFlag from "@/components/assets/flags/DE.svg";
import EsFlag from "@/components/assets/flags/ES.svg";
import ItFlag from "@/components/assets/flags/IT.svg";
import TrFlag from "@/components/assets/flags/TR.svg";
// import UkFlag from "@/components/assets/flags/UK.svg";
import UsFlag from "@/components/assets/flags/US.svg";
import { useUiText } from "@/components/context/i18n/useUiText";
import { Text } from "@/components/typography/Text";
import { AppIcon } from "@/components/ui/app-icon";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Search } from "@/components/ui/search";
import { Separator } from "@/components/ui/separator";
import type { UiMessages, UiT } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";

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
  flag: string;
}

const ALL_LANGUAGES: LanguageDef[] = [
  { locale: "en-US", label: "American English", short: "en-US", flag: UsFlag },
  // { locale: "en-GB", label: "British English", short: "en-GB", flag: UkFlag },
  { locale: "es-ES", label: "Español (España)", short: "es-ES", flag: EsFlag },
  // { locale: "es-AR", label: "Español (Argentina)", short: "es-AR", flag: ArFlag },
  {
    locale: "de-DE",
    label: "Deutsch (Deutschland)",
    short: "de-DE",
    flag: GerFlag,
  },
  // { locale: "de-AT", label: "Deutsch (Österreich)", short: "de-AT", flag: AtFlag },
  { locale: "it-IT", label: "Italiano", short: "it-IT", flag: ItFlag },
  { locale: "tr-TR", label: "Türkçe", short: "tr-TR", flag: TrFlag },
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
      className={cn(
        "flex items-center justify-between gap-4 rounded-md px-2 py-1 outline-none cursor-pointer focus:ring-2 focus:ring-brand-200"
      )}
    >
      <div className="flex min-w-0 items-center gap-4">
        <img src={def.flag} alt={`${def.label} flag`} className="h-8 w-8" />
        <div className="flex flex-col gap-0.5">
          <Text variant="titleSm" as="span">
            {def.label}
          </Text>
          <Text variant="caption" as="span">
            {def.short ?? def.locale}
          </Text>
        </div>
      </div>
      <span className="flex h-5 w-5 items-center justify-center" aria-hidden="true">
        {isActive ? <AppIcon icon={CheckIcon} className="text-text-300 stroke-[1.75]" size="md" /> : null}
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

      <DrawerContent className="max-w-[430px] bg-elevation-50 py-4 px-5 mx-auto">
        <DrawerDescription className="sr-only">
          {uiText({ key: "ui.languagePreference.description", legacyKey: "settings.languagePreference.description", messages, t })}
        </DrawerDescription>
        <DrawerTitle className="text-text-300 text-left text-lg font-medium leading-[28px] mb-3">
          {uiText({ key: "ui.languagePreference.title", legacyKey: "settings.languagePreference.title", messages, t })}
        </DrawerTitle>

        <div
          className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1"
          role="group"
          aria-label={uiText({ key: "ui.languagePreference.groupLabel", messages, t })}
        >
          <div ref={searchContainerRef} className="sticky top-0 z-10 pt-0 dark:bg-elevation-250">
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
            className="flex flex-col gap-3 pb-2"
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
                  {idx < available.length - 1 && <Separator key={`${def.locale}-sep`} className="bg-divider-75" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
