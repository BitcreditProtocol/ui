import { cva } from "class-variance-authority";
import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppIcon } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";

interface SearchProps {
  value?: string;
  placeholder: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSearch?: (query: string) => void;
  enableDebounce?: boolean;
  debounceMs?: number;
}

const noopSearch = () => {};

const searchVariants = cva(
  "flex items-center gap-1.5 bg-elevation-50 border border-divider-75 rounded-[8px] transition-all ease-in-out duration-200 hover:bg-elevation-250 hover:border-divider-50 focus-within:bg-elevation-250 focus-within:border-divider-300",
  {
    variants: {
      size: {
        xs: "p-2 text-xs",
        sm: "px-4 py-3 text-sm",
        md: "p-4 text-sm",
        lg: "px-4 py-5 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

function Search({
  value,
  placeholder,
  size,
  className,
  onChange,
  onFocus,
  onBlur,
  onSearch,
  enableDebounce = true,
  debounceMs = 300,
}: SearchProps) {
  const searchFieldRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);
  const [internalValue, setInternalValue] = useState(value ?? "");

  const currentValue = value !== undefined ? value : internalValue;
  const hasValue = currentValue.length > 0;
  const latestOnSearch = useRef(onSearch ?? noopSearch);
  useEffect(() => {
    latestOnSearch.current = onSearch ?? noopSearch;
  }, [onSearch]);

  const focusSearchField = () => {
    searchFieldRef.current?.focus();
  };

  const flushDebounce = () => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      flushDebounce();
      latestOnSearch.current(currentValue);
    }

    if (event.key === "Escape") {
      flushDebounce();
      updateValue("");
      latestOnSearch.current("");
    }
  };

  const updateValue = (next: string) => {
    if (value === undefined) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  useEffect(() => {
    if (!enableDebounce) {
      return;
    }

    flushDebounce();
    debounceRef.current = window.setTimeout(() => {
      latestOnSearch.current(currentValue);
      debounceRef.current = null;
    }, debounceMs);

    return flushDebounce;
  }, [currentValue, enableDebounce, debounceMs]);

  return (
    <div onClick={focusSearchField} className={cn(searchVariants({ size }), className)}>
      <AppIcon
        icon={SearchIcon}
        className={cn("text-text-300", {
          "h-4 w-4": size === "xs",
          "h-5 w-5": size !== "xs",
        })}
      />

      <input
        ref={searchFieldRef}
        value={currentValue}
        onChange={(e) => {
          updateValue(e.target.value);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        type="text"
        placeholder={placeholder}
        className="w-full text-text-300 bg-transparent font-medium placeholder-text-300 focus:outline-hidden"
        enterKeyHint="done"
        onKeyDown={handleKeyDown}
      />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          updateValue("");
          flushDebounce();
          latestOnSearch.current("");
        }}
        className={cn("transition-opacity duration-200 ease-out", hasValue ? "opacity-100" : "opacity-0 pointer-events-none")}
        aria-label="Clear search"
        tabIndex={hasValue ? 0 : -1}
      >
        <AppIcon
          icon={XIcon}
          className={cn({
            "h-3 w-3": size === "xs",
            "h-4 w-4": size !== "xs",
          })}
          strokeWidth={1.5}
        />
      </button>
    </div>
  );
}

export { Search };
export default Search;
