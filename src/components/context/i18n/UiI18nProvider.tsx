import { createContext, useCallback, useContext } from "react";
import { IntlContext } from "react-intl";

import {
  getUiText,
  type UiMessages,
  type UiT,
  type UiTranslationKey,
  type UiTranslationValues,
} from "@/lib/ui-i18n";

type UiI18nContextValue = {
  devMissingMarker?: boolean;
  messages?: UiMessages;
  t?: UiT;
};

type UseUiTextOptions = {
  key: UiTranslationKey;
  params?: UiTranslationValues;
  t?: UiT;
  messages?: UiMessages;
  legacyKey?: string;
  legacyParams?: UiTranslationValues;
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

export function useUiText() {
  const uiI18n = useContext(UiI18nContext);
  const intl = useContext(IntlContext);

  return useCallback(
    ({ key, legacyKey, legacyParams, messages, params, t }: UseUiTextOptions) =>
      getUiText({
        key,
        params,
        t: t ?? uiI18n.t,
        messages: messages ?? uiI18n.messages,
        intl,
        legacyKey,
        legacyParams,
        devMissingMarker: uiI18n.devMissingMarker,
      }),
    [intl, uiI18n]
  );
}
