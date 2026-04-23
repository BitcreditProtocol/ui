import { createContext } from "react";

import type { UiMessages, UiT } from "@/lib/ui-i18n";

type UiI18nContextValue = {
  devMissingMarker?: boolean;
  messages?: UiMessages;
  t?: UiT;
};

const UiI18nContext = createContext<UiI18nContextValue>({});

export function UiI18nProvider({
  children,
  devMissingMarker,
  messages,
  t,
}: {
  children: React.ReactNode;
  devMissingMarker?: boolean;
  messages?: UiMessages;
  t?: UiT;
}) {
  return <UiI18nContext.Provider value={{ devMissingMarker, messages, t }}>{children}</UiI18nContext.Provider>;
}

export { UiI18nContext };
