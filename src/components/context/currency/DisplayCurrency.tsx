import { BanknoteIcon } from "lucide-react";
import { useUiText } from "@/components/context/i18n/UiI18nProvider";
import { AppIcon } from "@/components/ui/app-icon";
import type { UiMessages, UiT } from "@/lib/ui-i18n";
import MenuOption from "../MenuOption";
import { usePreferences } from "../preferences/PreferencesContext";
import { CurrencySelector } from "./CurrencySelector";

type DisplayCurrencyProps = {
  messages?: UiMessages;
  t?: UiT;
};

export default function DisplayCurrency({ messages, t }: DisplayCurrencyProps) {
  const uiText = useUiText();
  const { currency, setCurrency } = usePreferences();
  const displayValue = currency === "sat" ? "sat" : currency.toUpperCase();

  const handleChange = (value: string) => {
    const normalized = value.toLowerCase();
    if (normalized === "usd" || normalized === "eur" || normalized === "btc" || normalized === "sat") {
      setCurrency(normalized as typeof currency);
    }
  };

  return (
    <CurrencySelector value={currency} onChange={handleChange} messages={messages} t={t}>
      <MenuOption
        icon={<AppIcon icon={BanknoteIcon} className="text-text-300" size="lg" />}
        label={uiText({ key: "ui.currencySelector.menuLabel", legacyKey: "settings.displayCurrency", messages, t })}
        defaultValue={displayValue}
      />
    </CurrencySelector>
  );
}
