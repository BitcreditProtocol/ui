import { useCallback, useContext } from "react";
import { IntlContext } from "react-intl";

import { UiI18nContext } from "@/components/context/i18n/UiI18nProvider";
import { getUiText, type UiMessages, type UiT, type UiTranslationKey, type UiTranslationValues } from "@/lib/ui-i18n";

type UseUiTextOptions = {
  key: UiTranslationKey;
  params?: UiTranslationValues;
  t?: UiT;
  messages?: UiMessages;
  legacyKey?: string;
  legacyParams?: UiTranslationValues;
};

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
