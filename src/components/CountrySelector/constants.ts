import type { MessageDescriptor } from "react-intl";

import { COUNTRIES, type CountryCode, getCountryMessage } from "@/constants/countries";

import type { CountryOption } from "./types";

export function getCountryOptions(formatMessage: (message: MessageDescriptor) => string): CountryOption[] {
  return (Object.keys(COUNTRIES) as CountryCode[]).map((code) => {
    const defaultName = COUNTRIES[code];
    const message = getCountryMessage(code);
    const name = message ? formatMessage(message) : defaultName;

    return {
      code,
      name,
      searchable: `${name} ${defaultName} ${code}`.toLowerCase(),
    };
  });
}

export const IOS_STANDALONE_KEYBOARD_ACCESSORY_OFFSET_PX = 96;
export const IOS_STANDALONE_MIN_DROPDOWN_HEIGHT_PX = 220;
