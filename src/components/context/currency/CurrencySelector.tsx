import { CheckIcon } from "lucide-react";
import React, { type PropsWithChildren, useMemo, useRef, useState } from "react";

import { useUiText } from "@/components/context/i18n/useUiText";
import { AppIcon } from "@/components/ui/app-icon";
import { Drawer, DrawerContent, DrawerDescription, DrawerScrollArea, DrawerTopBar, DrawerTrigger } from "@/components/ui/drawer";
import { Search } from "@/components/ui/search";
import { Separator } from "@/components/ui/separator";
import type { FiatCurrencyCode } from "@/constants/currencies";
import { FIAT_CURRENCY_CODES, PINNED_FIAT_CURRENCY_CODES } from "@/constants/currencies";
import type { UiMessages, UiT, UiTranslationKey } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";
import { getCurrencyFlagEmoji } from "@/utils/flagEmoji";

function BitcoinBadge() {
  return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7931A] text-xs font-semibold text-white">B</div>;
}

/** Flag of the issuing country, falling back to the code for currencies without one. */
function FiatBadge({ code }: { code: string }) {
  const flag = getCurrencyFlagEmoji(code);

  if (flag) {
    return <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg text-[28px] leading-[38px]">{flag}</span>;
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[10px] font-semibold uppercase text-muted-foreground">
      {code.slice(0, 3).toUpperCase()}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-text-300 text-base font-medium leading-6">{children}</span>;
}

function Description({ children }: { children: React.ReactNode }) {
  return <span className="text-text-200 text-sm font-normal leading-5">{children}</span>;
}

const CURRENCY_ROW_CLASSES = "flex w-full items-center gap-3 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-brand-200";

type CurrencySelectorProps = PropsWithChildren<{
  value: string;
  onChange: (value: string) => void;
  messages?: UiMessages;
  t?: UiT;
}>;

type CurrencyDef = {
  code: string;
  labelKey: UiTranslationKey;
  icon: React.ReactNode;
};

const PINNED_SET = new Set<FiatCurrencyCode>(PINNED_FIAT_CURRENCY_CODES);

const CUSTOM_ICONS: Partial<Record<string, React.ReactNode>> = {
  /** examples:
   *  usd: (
    <div className="flex items-center justify-center h-8 w-8 p-2 bg-[#118200] rounded-full">
      <AppIcon icon={DollarSignIcon} className="text-white" />
    </div>
  ),
  eur: (
    <div className="flex items-center justify-center h-8 w-8 p-2 bg-[#003398] rounded-full">
      <AppIcon icon={EuroIcon} className="text-white" />
    </div>
  ), */
};

function makeFiatDef(code: FiatCurrencyCode): CurrencyDef {
  return {
    code,
    labelKey: `ui.currencySelector.option.${code}` satisfies UiTranslationKey,
    icon: CUSTOM_ICONS[code] ?? <FiatBadge code={code} />,
  };
}

const CRYPTO_DEFS: CurrencyDef[] = [
  { code: "btc", labelKey: "ui.currencySelector.option.btc", icon: <BitcoinBadge /> },
  { code: "sat", labelKey: "ui.currencySelector.option.sat", icon: <BitcoinBadge /> },
];

const ALL_CURRENCIES: CurrencyDef[] = [
  ...CRYPTO_DEFS,
  ...PINNED_FIAT_CURRENCY_CODES.map(makeFiatDef),
  ...FIAT_CURRENCY_CODES.filter((code) => !PINNED_SET.has(code)).map(makeFiatDef),
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
  const label = uiText({ key: def.labelKey, messages, t });

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
      className={cn(CURRENCY_ROW_CLASSES)}
    >
      <span className="shrink-0" aria-hidden="true">
        {def.icon}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Label>{label}</Label>
        <Description>{def.code === "sat" ? "sat" : def.code.toUpperCase()}</Description>
      </div>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center" aria-hidden="true">
        {isActive ? <AppIcon icon={CheckIcon} className="text-text-300" size="lg" /> : null}
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
        uiText({ key: c.labelKey, messages, t }).toLowerCase().includes(normalizedSearch) || c.code.toLowerCase().includes(normalizedSearch)
    );
  }, [normalizedSearch, messages, t, uiText]);

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
      if (el && el instanceof HTMLElement) el.focus();
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
        <DrawerTopBar
          title={uiText({ key: "ui.currencySelector.title", legacyKey: "settings.displayCurrency.title", messages, t })}
          messages={messages}
          t={t}
        />
        <DrawerDescription className="sr-only">
          {uiText({ key: "ui.currencySelector.description", legacyKey: "settings.displayCurrency.description", messages, t })}
        </DrawerDescription>

        <DrawerScrollArea
          className="flex-1"
          viewportClassName="flex max-h-[65vh] flex-col gap-6 overflow-y-auto pr-1 pb-10"
          role="group"
          aria-label={uiText({ key: "ui.currencySelector.title", messages, t })}
        >
          <div ref={searchContainerRef} className="sticky top-0 z-10 bg-elevation-50 pt-0 dark:bg-elevation-250">
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
            className="flex flex-col gap-2 pb-2"
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
                {idx < available.length - 1 && <Separator className="bg-divider-50" />}
              </React.Fragment>
            ))}
          </div>
        </DrawerScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
