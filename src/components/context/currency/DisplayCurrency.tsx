import { BanknoteIcon } from "lucide-react";
import { useIntl } from "react-intl";
import { AppIcon } from "@/components/ui/app-icon";
import MenuOption from "../MenuOption";
import { usePreferences } from "../preferences/PreferencesContext";
import { CurrencySelector } from "./CurrencySelector";

export default function DisplayCurrency() {
  const intl = useIntl();
  const { currency, setCurrency } = usePreferences();
  const displayValue = currency === "sat" ? "sat" : currency.toUpperCase();

  const handleChange = (value: string) => {
    const normalized = value.toLowerCase();
    if (normalized === "usd" || normalized === "eur" || normalized === "btc" || normalized === "sat") {
      setCurrency(normalized as typeof currency);
    }
  };

  return (
    <CurrencySelector value={currency} onChange={handleChange}>
      <MenuOption
        icon={<AppIcon icon={BanknoteIcon} className="text-text-300" size="lg" />}
        label={intl.formatMessage({
          id: "settings.displayCurrency",
          defaultMessage: "Display currency",
          description: "Display currency menu item",
        })}
        defaultValue={displayValue}
      />
    </CurrencySelector>
  );
}
