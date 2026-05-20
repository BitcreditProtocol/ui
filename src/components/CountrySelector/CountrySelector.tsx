import React, { useCallback, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { IntlContext, type MessageDescriptor } from "react-intl";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { COUNTRIES, type CountryCode, getCountryMessage } from "@/constants/countries";
import { IOS_STANDALONE_POPOVER_TOP_CLEARANCE_PX } from "@/constants/layout";
import { cn } from "@/lib/utils";
import { isAndroid, isInStandaloneMode, isIOS } from "@/utils/platform";

import { CountrySelectorPanel } from "./CountrySelectorPanel";
import { CountrySelectorTrigger } from "./CountrySelectorTrigger";
import { getCountryOptions } from "./constants";
import type { CountrySelectorProps } from "./types";
import { useCountrySelectorPosition } from "./useCountrySelectorPosition";
import { useCountrySelectorStandaloneIOS } from "./useCountrySelectorStandaloneIOS";

const CountrySelector = React.forwardRef<HTMLButtonElement, CountrySelectorProps>(function CountrySelector(
  { label, value, callback, required: isRequiredField, isRequired, name, onBlur, onChange, hasError, className, ...buttonProps },
  forwardedRef
) {
  const intl = React.useContext(IntlContext);
  const formatMessage = useCallback(
    (message: MessageDescriptor) => intl?.formatMessage(message) ?? String(message.defaultMessage ?? message.id),
    [intl]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const selectedItemRef = useRef<HTMLDivElement | null>(null);

  const isStandalone = typeof window !== "undefined" && isInStandaloneMode();
  const isIOSStandalone = isStandalone && isIOS();
  const topClearance = isStandalone ? (isIOS() ? IOS_STANDALONE_POPOVER_TOP_CLEARANCE_PX : isAndroid() ? 72 : 56) : 0;
  const bottomClearance = isStandalone ? 16 : 0;

  const countryOptions = useMemo(() => getCountryOptions(formatMessage), [formatMessage]);

  const filteredCountries = useMemo(() => {
    const lower = search.toLowerCase();
    return countryOptions.filter(({ searchable }) => searchable.includes(lower));
  }, [countryOptions, search]);

  const selectedCode = value?.toUpperCase() as CountryCode | undefined;
  const selectedCountryMessage = selectedCode ? getCountryMessage(selectedCode) : null;
  const selectedName = selectedCountryMessage
    ? formatMessage(selectedCountryMessage)
    : selectedCode && selectedCode in COUNTRIES
      ? COUNTRIES[selectedCode]
      : "";
  const hasValue = !!value;
  const isRequiredResolved = isRequiredField ?? isRequired;

  const setTriggerRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
        return;
      }

      if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  const emitChange = useCallback(
    (nextValue: string | undefined) => {
      onChange?.({
        target: {
          name,
          value: nextValue ?? "",
        },
      });
    },
    [name, onChange]
  );

  const handleValueChange = useCallback(
    (nextValue: string | undefined) => {
      callback(nextValue);
      emitChange(nextValue);
    },
    [callback, emitChange]
  );

  const focusSearchInput = useCallback(() => {
    if (typeof searchInputRef.current?.focus === "function") {
      searchInputRef.current.focus();
    }
  }, []);

  const { ensureStandaloneBottomSpace, ensureTriggerVisible } = useCountrySelectorStandaloneIOS({
    isOpen,
    isIOSStandalone,
    bottomClearance,
    topClearance,
    containerRef,
    triggerRef,
    setOpen: setIsOpen,
  });

  const { contentSide, popoverContentStyle, recomputePosition } = useCountrySelectorPosition({
    isOpen,
    value,
    isIOSStandalone,
    topClearance,
    bottomClearance,
    triggerRef,
    searchInputRef,
    selectedItemRef,
    ensureTriggerVisible,
    ensureStandaloneBottomSpace,
  });

  const triggerButton = (
    <CountrySelectorTrigger
      ref={setTriggerRefs}
      label={label}
      hasValue={hasValue}
      selectedName={selectedName}
      isRequired={isRequiredResolved}
      isOpen={isOpen}
      hasError={hasError}
      clearAriaLabel={formatMessage({
        id: "countrySelector.clear",
        defaultMessage: "Clear country",
      })}
      onClear={() => {
        handleValueChange(undefined);
      }}
      name={name}
      onBlur={onBlur}
      className={className}
      {...buttonProps}
    />
  );

  const contentBody = (
    <CountrySelectorPanel
      search={search}
      searchPlaceholder={formatMessage({
        id: "countrySelector.search",
        defaultMessage: "Search for a country...",
      })}
      noResultsLabel={formatMessage({
        id: "countrySelector.noResults",
        defaultMessage: "No country found.",
      })}
      value={value}
      filteredCountries={filteredCountries}
      searchInputRef={searchInputRef}
      selectedItemRef={selectedItemRef}
      onSearchChange={setSearch}
      onSearchFocus={(e) => {
        e.stopPropagation();
        window.requestAnimationFrame(() => {
          recomputePosition();
          ensureTriggerVisible();
        });
      }}
      onSelect={(nextValue) => {
        handleValueChange(nextValue);
        triggerRef.current?.blur();
        setIsOpen(false);
      }}
      onClearSearch={() => {
        setSearch("");
      }}
    />
  );

  if (isIOSStandalone) {
    return (
      <div ref={containerRef} className="relative w-full">
        <div
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
              return;
            }

            ensureTriggerVisible();
            ensureStandaloneBottomSpace();
            flushSync(() => {
              setIsOpen(true);
            });
            focusSearchInput();
          }}
        >
          {triggerButton}
        </div>
        {isOpen && (
          <div
            role="dialog"
            className={cn(
              "absolute left-0 z-50 rounded-lg border border-[#1B0F004D] bg-elevation-50 p-0 shadow-md",
              contentSide === "top" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]"
            )}
            style={popoverContentStyle}
          >
            {contentBody}
          </div>
        )}
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent
        isPortaled={false}
        side={contentSide}
        avoidCollisions={false}
        align="center"
        sideOffset={6}
        className="relative z-50 bg-elevation-50 border border-[#1B0F004D] rounded-lg shadow-md p-0"
        style={popoverContentStyle}
      >
        {contentBody}
      </PopoverContent>
    </Popover>
  );
});

export { CountrySelector };
