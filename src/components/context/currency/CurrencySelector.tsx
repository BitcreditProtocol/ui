import { CheckIcon, DollarSignIcon, EuroIcon } from "lucide-react";
import React, { type PropsWithChildren, useMemo, useRef, useState } from "react";

import { useUiText } from "@/components/context/i18n/useUiText";
import { AppIcon } from "@/components/ui/app-icon";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Search } from "@/components/ui/search";
import { Separator } from "@/components/ui/separator";
import type { UiMessages, UiT } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";

function BitcoinBadge() {
  return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7931A] text-xs font-semibold text-white">B</div>;
}

function FiatBadge({ code }: { code: string }) {
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

type CurrencySelectorProps = PropsWithChildren<{
  value: string;
  onChange: (value: string) => void;
  messages?: UiMessages;
  t?: UiT;
}>;

type CurrencyDef = {
  code: string;
  /** English display name (always present; used as fallback when no labelKey). */
  label: string;
  /** Optional i18n key for the 4 built-in currencies that have translations. */
  labelKey?:
    | "ui.currencySelector.option.usd"
    | "ui.currencySelector.option.eur"
    | "ui.currencySelector.option.btc"
    | "ui.currencySelector.option.sat";
  icon?: React.ReactNode;
};

const ALL_CURRENCIES: CurrencyDef[] = [
  {
    code: "usd",
    label: "US Dollar",
    labelKey: "ui.currencySelector.option.usd",
    icon: (
      <div className="flex items-center justify-center h-8 w-8 p-2 bg-[#118200] rounded-full">
        <AppIcon icon={DollarSignIcon} className="text-white" />
      </div>
    ),
  },
  {
    code: "eur",
    label: "Euro",
    labelKey: "ui.currencySelector.option.eur",
    icon: (
      <div className="flex items-center justify-center h-8 w-8 p-2 bg-[#003398] rounded-full">
        <AppIcon icon={EuroIcon} className="text-white" />
      </div>
    ),
  },
  {
    code: "btc",
    label: "Bitcoin (BTC)",
    labelKey: "ui.currencySelector.option.btc",
    icon: <BitcoinBadge />,
  },
  {
    code: "sat",
    label: "Bitcoin (sat)",
    labelKey: "ui.currencySelector.option.sat",
    icon: <BitcoinBadge />,
  },
  { code: "aed", label: "United Arab Emirates Dirham" },
  { code: "afn", label: "Afghan Afghani" },
  { code: "all", label: "Albanian Lek" },
  { code: "amd", label: "Armenian Dram" },
  { code: "ang", label: "Netherlands Antillean Gulden" },
  { code: "aoa", label: "Angolan Kwanza" },
  { code: "ars", label: "Argentine Peso" },
  { code: "arsmep", label: "Argentine Blue Dollar" },
  { code: "aud", label: "Australian Dollar" },
  { code: "awg", label: "Aruban Florin" },
  { code: "azn", label: "Azerbaijani Manat" },
  { code: "bam", label: "Bosnia and Herzegovina Convertible Mark" },
  { code: "bbd", label: "Barbadian Dollar" },
  { code: "bdt", label: "Bangladeshi Taka" },
  { code: "bgn", label: "Bulgarian Lev" },
  { code: "bhd", label: "Bahraini Dinar" },
  { code: "bif", label: "Burundian Franc" },
  { code: "bmd", label: "Bermudian Dollar" },
  { code: "bnd", label: "Brunei Dollar" },
  { code: "bob", label: "Bolivian Boliviano" },
  { code: "brl", label: "Real" },
  { code: "bsd", label: "Bahamian Dollar" },
  { code: "btn", label: "Bhutanese Ngultrum" },
  { code: "bwp", label: "Botswana Pula" },
  { code: "byn", label: "Belarusian Ruble" },
  { code: "byr", label: "Belarusian Ruble" },
  { code: "bzd", label: "Belize Dollar" },
  { code: "cad", label: "Canadian Dollar" },
  { code: "cdf", label: "Congolese Franc" },
  { code: "chf", label: "Swiss Franc" },
  { code: "clf", label: "Unidad de Fomento" },
  { code: "clp", label: "Chilean Peso" },
  { code: "cnh", label: "Chinese Renminbi Yuan Offshore" },
  { code: "cny", label: "Chinese Renminbi Yuan" },
  { code: "cop", label: "Colombian Peso" },
  { code: "crc", label: "Costa Rican Colón" },
  { code: "cuc", label: "Cuban Convertible Peso" },
  { code: "cup", label: "Cuban Peso" },
  { code: "cve", label: "Cape Verdean Escudo" },
  { code: "czk", label: "Czech Koruna" },
  { code: "djf", label: "Djiboutian Franc" },
  { code: "dkk", label: "Danish Krone" },
  { code: "dop", label: "Dominican Peso" },
  { code: "dzd", label: "Algerian Dinar" },
  { code: "egp", label: "Egyptian Pound" },
  { code: "etb", label: "Ethiopian Birr" },
  { code: "fjd", label: "Fijian Dollar" },
  { code: "fkp", label: "Falkland Pound" },
  { code: "gbp", label: "British Pound" },
  { code: "gel", label: "Georgian Lari" },
  { code: "ggp", label: "Guernsey Pound" },
  { code: "ghs", label: "Ghanaian Cedi" },
  { code: "gip", label: "Gibraltar Pound" },
  { code: "gmd", label: "Gambian Dalasi" },
  { code: "gnf", label: "Guinean Franc" },
  { code: "gtq", label: "Guatemalan Quetzal" },
  { code: "gyd", label: "Guyanese Dollar" },
  { code: "hkd", label: "Hong Kong Dollar" },
  { code: "hnl", label: "Honduran Lempira" },
  { code: "hrk", label: "Croatian Kuna" },
  { code: "htg", label: "Haitian Gourde" },
  { code: "huf", label: "Hungarian Forint" },
  { code: "idr", label: "Indonesian Rupiah" },
  { code: "ils", label: "Israeli New Sheqel" },
  { code: "imp", label: "Isle of Man Pound" },
  { code: "inr", label: "Indian Rupee" },
  { code: "iqd", label: "Iraqi Dinar" },
  { code: "irr", label: "Iranian Rial" },
  { code: "isk", label: "Icelandic Króna" },
  { code: "jep", label: "Jersey Pound" },
  { code: "jmd", label: "Jamaican Dollar" },
  { code: "jod", label: "Jordanian Dinar" },
  { code: "jpy", label: "Japanese Yen" },
  { code: "kes", label: "Kenyan Shilling" },
  { code: "kgs", label: "Kyrgyzstani Som" },
  { code: "khr", label: "Cambodian Riel" },
  { code: "kmf", label: "Comorian Franc" },
  { code: "krw", label: "South Korean Won" },
  { code: "kwd", label: "Kuwaiti Dinar" },
  { code: "kyd", label: "Cayman Islands Dollar" },
  { code: "kzt", label: "Kazakhstani Tenge" },
  { code: "lak", label: "Lao Kip" },
  { code: "lbp", label: "Lebanese Pound" },
  { code: "lkr", label: "Sri Lankan Rupee" },
  { code: "lrd", label: "Liberian Dollar" },
  { code: "lsl", label: "Lesotho Loti" },
  { code: "ltl", label: "Lithuanian Litas" },
  { code: "lvl", label: "Latvian Lats" },
  { code: "lyd", label: "Libyan Dinar" },
  { code: "mad", label: "Moroccan Dirham" },
  { code: "mdl", label: "Moldovan Leu" },
  { code: "mga", label: "Malagasy Ariary" },
  { code: "mkd", label: "Macedonian Denar" },
  { code: "mmk", label: "Myanmar Kyat" },
  { code: "mnt", label: "Mongolian Tögrög" },
  { code: "mop", label: "Macanese Pataca" },
  { code: "mro", label: "Mauritanian Ouguiya" },
  { code: "mru", label: "Mauritanian Ouguiya" },
  { code: "mur", label: "Mauritian Rupee" },
  { code: "mvr", label: "Maldivian Rufiyaa" },
  { code: "mwk", label: "Malawian Kwacha" },
  { code: "mxn", label: "Mexican Peso" },
  { code: "myr", label: "Malaysian Ringgit" },
  { code: "mzn", label: "Mozambican Metical" },
  { code: "nad", label: "Namibian Dollar" },
  { code: "ngn", label: "Nigerian Naira" },
  { code: "nio", label: "Nicaraguan Córdoba" },
  { code: "nok", label: "Norwegian Krone" },
  { code: "npr", label: "Nepalese Rupee" },
  { code: "nzd", label: "New Zealand Dollar" },
  { code: "omr", label: "Omani Rial" },
  { code: "pab", label: "Panamanian Balboa" },
  { code: "pen", label: "Peruvian Sol" },
  { code: "pgk", label: "Papua New Guinean Kina" },
  { code: "php", label: "Philippine Peso" },
  { code: "pkr", label: "Pakistani Rupee" },
  { code: "pln", label: "Polish Złoty" },
  { code: "pyg", label: "Paraguayan Guaraní" },
  { code: "qar", label: "Qatari Riyal" },
  { code: "ron", label: "Romanian Leu" },
  { code: "rsd", label: "Serbian Dinar" },
  { code: "rub", label: "Russian Ruble" },
  { code: "rwf", label: "Rwandan Franc" },
  { code: "sar", label: "Saudi Riyal" },
  { code: "sbd", label: "Solomon Islands Dollar" },
  { code: "scr", label: "Seychellois Rupee" },
  { code: "sdg", label: "Sudanese Pound" },
  { code: "sek", label: "Swedish Krona" },
  { code: "sgd", label: "Singapore Dollar" },
  { code: "shp", label: "Saint Helenian Pound" },
  { code: "skk", label: "Slovak Koruna" },
  { code: "sll", label: "Sierra Leonean Leone" },
  { code: "sos", label: "Somali Shilling" },
  { code: "srd", label: "Surinamese Dollar" },
  { code: "ssp", label: "South Sudanese Pound" },
  { code: "std", label: "São Tomé and Príncipe Dobra" },
  { code: "svc", label: "Salvadoran Colón" },
  { code: "syp", label: "Syrian Pound" },
  { code: "szl", label: "Swazi Lilangeni" },
  { code: "thb", label: "Thai Baht" },
  { code: "tjs", label: "Tajikistani Somoni" },
  { code: "tmm", label: "Turkmenistani Manat" },
  { code: "tmt", label: "Turkmenistani Manat" },
  { code: "tnd", label: "Tunisian Dinar" },
  { code: "top", label: "Tongan Paʻanga" },
  { code: "try", label: "Turkish Lira" },
  { code: "ttd", label: "Trinidad and Tobago Dollar" },
  { code: "twd", label: "New Taiwan Dollar" },
  { code: "tzs", label: "Tanzanian Shilling" },
  { code: "uah", label: "Ukrainian Hryvnia" },
  { code: "ugx", label: "Ugandan Shilling" },
  { code: "uyu", label: "Uruguayan Peso" },
  { code: "uzs", label: "Uzbekistan Som" },
  { code: "vef", label: "Venezuelan Bolívar" },
  { code: "ves", label: "Venezuelan Bolívar Soberano" },
  { code: "vnd", label: "Vietnamese Đồng" },
  { code: "vuv", label: "Vanuatu Vatu" },
  { code: "wst", label: "Samoan Tala" },
  { code: "xaf", label: "Central African CFA Franc" },
  { code: "xag", label: "Silver (Troy Ounce)" },
  { code: "xau", label: "Gold (Troy Ounce)" },
  { code: "xcd", label: "East Caribbean Dollar" },
  { code: "xdr", label: "Special Drawing Rights" },
  { code: "xof", label: "West African CFA Franc" },
  { code: "xpd", label: "Palladium" },
  { code: "xpf", label: "CFP Franc" },
  { code: "xpt", label: "Platinum" },
  { code: "yer", label: "Yemeni Rial" },
  { code: "zar", label: "South African Rand" },
  { code: "zmk", label: "Zambian Kwacha" },
  { code: "zmw", label: "Zambian Kwacha" },
  { code: "zwd", label: "Zimbabwean Dollar" },
];

// Attach generic badge icons to fiat currencies that don't have a custom icon.
const ALL_CURRENCIES_WITH_ICONS: CurrencyDef[] = ALL_CURRENCIES.map((c) =>
  c.icon ? c : { ...c, icon: <FiatBadge code={c.code} /> }
);

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
          <Label>{def.labelKey ? uiText({ key: def.labelKey, messages, t }) : def.label}</Label>
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
    if (!normalizedSearch) return ALL_CURRENCIES_WITH_ICONS;
    return ALL_CURRENCIES_WITH_ICONS.filter(
      (c) =>
        c.label.toLowerCase().includes(normalizedSearch) ||
        (c.labelKey ? uiText({ key: c.labelKey, messages, t }).toLowerCase().includes(normalizedSearch) : false) ||
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

        <div
          className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1"
          role="group"
          aria-label={uiText({ key: "ui.currencySelector.title", messages, t })}
        >
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
