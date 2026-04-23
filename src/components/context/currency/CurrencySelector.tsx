import { CheckIcon, DollarSignIcon, EuroIcon } from "lucide-react";
import React, { type PropsWithChildren, useMemo, useRef, useState } from "react";

import { useUiText } from "@/components/context/i18n/UiI18nProvider";
import { AppIcon } from "@/components/ui/app-icon";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Search } from "@/components/ui/search";
import { Separator } from "@/components/ui/separator";
import type { UiMessages, UiT } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";

function BitcoinBadge() {
  return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7931A] text-xs font-semibold text-white">B</div>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-text-300 text-base font-medium leading-6">{children}</span>;
}

function Description({ children }: { children: React.ReactNode }) {
  return <span className="text-text-200 text-sm font-normal leading-5">{children}</span>;
}

type CurrencySelectorProps = PropsWithChildren<{
  value: string;
  onChange: (value: string) => void;
  messages?: UiMessages;
  t?: UiT;
}>;

type CurrencyDef = {
  code: string;
  labelKey: "ui.currencySelector.option.usd" | "ui.currencySelector.option.eur" | "ui.currencySelector.option.btc" | "ui.currencySelector.option.sat";
  legacyLabel: string;
  icon?: React.ReactNode;
};

const ALL_CURRENCIES: CurrencyDef[] = [
  {
    code: "usd",
    labelKey: "ui.currencySelector.option.usd",
    legacyLabel: "US Dollar",
    icon: (
      <div className="flex items-center justify-center h-8 w-8 p-2 bg-[#118200] rounded-full">
        <AppIcon icon={DollarSignIcon} className="text-white" />
      </div>
    ),
  },
  {
    code: "eur",
    labelKey: "ui.currencySelector.option.eur",
    legacyLabel: "Euro",
    icon: (
      <div className="flex items-center justify-center h-8 w-8 p-2 bg-[#003398] rounded-full">
        <AppIcon icon={EuroIcon} className="text-white" />
      </div>
    ),
  },
  {
    code: "btc",
    labelKey: "ui.currencySelector.option.btc",
    legacyLabel: "Bitcoin (BTC)",
    icon: <BitcoinBadge />,
  },
  {
    code: "sat",
    labelKey: "ui.currencySelector.option.sat",
    legacyLabel: "Bitcoin (sat)",
    icon: <BitcoinBadge />,
  },
];

function CurrencyOption({
  def,
  isActive,
  onSelect,
  tabIndex,
  messages,
  t,
}: {
  def: CurrencyDef;
  isActive: boolean;
  onSelect: (code: string) => void;
  tabIndex: number;
  messages?: UiMessages;
  t?: UiT;
}) {
  const uiText = useUiText();
  return (
    <div
      role="radio"
      aria-checked={isActive}
      tabIndex={tabIndex}
      onClick={() => {
        onSelect(def.code);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(def.code);
        }
      }}
      className={cn(
        "flex items-center justify-between gap-4 rounded-md px-2 py-1 outline-none cursor-pointer focus:ring-2 focus:ring-brand-200"
      )}
    >
      <div className="flex min-w-0 items-center gap-4">
        {def.icon}
        <div className="flex flex-col gap-0.5">
          <Label>{uiText({ key: def.labelKey, messages, t })}</Label>
          <Description>{def.code === "sat" ? "sat" : def.code.toUpperCase()}</Description>
        </div>
      </div>
      <span className="flex h-5 w-5 items-center justify-center" aria-hidden="true">
        {isActive ? <AppIcon icon={CheckIcon} className="text-text-300 stroke-[1.75]" size="md" /> : null}
      </span>
    </div>
  );
}

export function CurrencySelector({ children, onChange, value, messages, t }: CurrencySelectorProps) {
  const uiText = useUiText();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const normalizedSearch = useMemo(() => searchTerm.trim().toLowerCase(), [searchTerm]);
  const available = useMemo(() => {
    if (!normalizedSearch) return ALL_CURRENCIES;
    return ALL_CURRENCIES.filter(
      (c) =>
        c.legacyLabel.toLowerCase().includes(normalizedSearch) ||
        uiText({ key: c.labelKey, messages, t }).toLowerCase().includes(normalizedSearch) ||
        c.code.toLowerCase().includes(normalizedSearch)
    );
  }, [messages, normalizedSearch, t, uiText]);

  const hasNoResults = normalizedSearch.length > 0 && available.length === 0;

  const _onChange = (code: string) => {
    onChange(code);
    setIsOpen(false);
  };

  const handleKeyDownGroup = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!listRef.current) return;

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

      <DrawerContent className="max-w-[430px] py-4 px-5 bg-elevation-50 mx-auto">
        <DrawerTitle className="text-text-300 text-lg font-medium leading-[28px] mb-3">
          {uiText({ key: "ui.currencySelector.title", legacyKey: "settings.displayCurrency.title", messages, t })}
        </DrawerTitle>
        <DrawerDescription className="sr-only">
          {uiText({ key: "ui.currencySelector.description", legacyKey: "settings.displayCurrency.description", messages, t })}
        </DrawerDescription>

        <div className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1" role="group" aria-label={uiText({ key: "ui.currencySelector.title", messages, t })}>
          <div ref={searchContainerRef} className="sticky top-0 z-10 pt-0 pb-2">
            <Search
              className={cn(
                "bg-elevation-50 hover:bg-elevation-250 focus:bg-elevation-250",
                "dark:bg-elevation-250 dark:hover:bg-elevation-50 dark:focus:bg-elevation-50"
              )}
              value={searchTerm}
              placeholder={uiText({ key: "ui.currencySelector.searchPlaceholder", legacyKey: "currency.search.placeholder", messages, t })}
              onChange={(val) => {
                setSearchTerm(val);
              }}
              onSearch={(query) => {
                setSearchTerm(query);
              }}
              size="sm"
            />

            <div aria-live="polite" className="sr-only">
              {hasNoResults
                ? uiText({ key: "ui.currencySelector.noResults", legacyKey: "currency.search.no.results", messages, t })
                : uiText({
                    key: "ui.currencySelector.resultsCount",
                    legacyKey: "currency.search.results.count",
                    params: { count: available.length },
                    messages,
                    t,
                  })}
            </div>
          </div>

          <div
            ref={listRef}
            role="radiogroup"
            tabIndex={0}
            aria-label={uiText({ key: "ui.currencySelector.ariaLabel", messages, t })}
            onKeyDown={handleKeyDownGroup}
            className="flex flex-col gap-3 pb-2"
          >
            {available.map((def, idx) => (
              <React.Fragment key={def.code}>
                <CurrencyOption
                  def={def}
                  isActive={value.toLowerCase() === def.code}
                  onSelect={_onChange}
                  messages={messages}
                  t={t}
                  tabIndex={value.toLowerCase() === def.code ? 0 : idx === 0 ? 0 : -1}
                />
                {idx < available.length - 1 && <Separator className="bg-divider-75" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
