import { CheckIcon, XIcon } from "lucide-react";
import React from "react";

import { AppIcon } from "@/components/ui/app-icon";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import type { CountryOption } from "./types";

type Props = {
  search: string;
  searchPlaceholder: string;
  clearSearchAriaLabel: string;
  noResultsLabel: string;
  value?: string;
  filteredCountries: CountryOption[];
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  selectedItemRef: React.RefObject<HTMLDivElement | null>;
  onSearchChange: (value: string) => void;
  onSearchFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
  onSelect: (value: string) => void;
  onClearSearch: () => void;
};

function CountrySelectorPanel({
  search,
  searchPlaceholder,
  clearSearchAriaLabel,
  noResultsLabel,
  value,
  filteredCountries,
  searchInputRef,
  selectedItemRef,
  onSearchChange,
  onSearchFocus,
  onSelect,
  onClearSearch,
}: Props) {
  return (
    <>
      <div className="flex-shrink-0 bg-elevation-50">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder={searchPlaceholder}
            className="text-text-300 w-full border-b border-[#1B0F004D] bg-elevation-50 dark:bg-elevation-200 p-4 pr-10 outline-none text-sm placeholder:text-text-300"
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            onFocus={onSearchFocus}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
          />
          {search && (
            <button
              type="button"
              aria-label={clearSearchAriaLabel}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-elevation-50 dark:bg-elevation-200 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onClearSearch();
              }}
            >
              <AppIcon icon={XIcon} className="text-text-300" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <ScrollArea className="h-full">
          <Command shouldFilter={false}>
            <CommandEmpty className="py-2 text-center text-sm">{noResultsLabel}</CommandEmpty>
            <CommandGroup className="p-1 space-y-1">
              {filteredCountries.map(({ code, name }) => (
                <CommandItem
                  key={code}
                  ref={value?.toUpperCase() === code ? selectedItemRef : undefined}
                  value={name}
                  keywords={[code]}
                  onSelect={() => {
                    onSelect(code);
                  }}
                  className="relative mb-1 flex w-full cursor-default select-none items-center rounded-md px-2 py-2.5 text-sm font-medium text-text-300 outline-hidden transition-colors data-[selected=true]:bg-elevation-250 data-[selected=true]:text-inherit data-highlighted:bg-elevation-250 data-highlighted:text-inherit dark:data-[selected=true]:bg-elevation-250 dark:data-highlighted:bg-elevation-250 data-[state=checked]:bg-elevation-250 dark:data-[state=checked]:bg-elevation-250"
                >
                  <AppIcon
                    icon={CheckIcon}
                    className={cn("text-[#006F29] mr-2 h-4 w-4", value?.toUpperCase() === code ? "opacity-100" : "opacity-0")}
                  />
                  {name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </ScrollArea>
      </div>
    </>
  );
}

export { CountrySelectorPanel };
