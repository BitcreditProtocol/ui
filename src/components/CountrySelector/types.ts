import type { ButtonProps } from "@/components/ui/button";
import type { CountryCode } from "@/constants/countries";

export type CountrySelectorProps = Omit<ButtonProps, "children" | "value" | "onChange"> & {
  label: string;
  value?: string;
  callback: (value: string | undefined) => void;
  required?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
  onChange?: (event: { target: { name?: string; value: string } }) => void;
};

export type CountryOption = {
  code: CountryCode;
  name: string;
  searchable: string;
};
