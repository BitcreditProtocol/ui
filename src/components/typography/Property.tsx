import React from "react";

import { TruncatedTextPopover } from "@/components/TruncatedText/TruncatedTextPopover";
import { cn } from "@/lib/utils";

import { Text } from "./Text";

type PropertyProps = {
  label: React.ReactNode;
  value: React.ReactNode | string | null | undefined;
  maxLength?: number;
  truncate?: boolean;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  placeholder?: React.ReactNode;
  placeholderClassName?: string;
  valueIgnoreTest?: boolean;
};

export function Property({
  label,
  value,
  maxLength,
  truncate: shouldTruncate = true,
  className,
  labelClassName,
  valueClassName,
  placeholder = "-",
  placeholderClassName,
  valueIgnoreTest: isValueIgnoreTest = false,
}: PropertyProps) {
  const shouldDisplayPlaceholder = value === null || value === undefined || (typeof value === "string" && value.trim() === "");

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Text variant="caption" as="span" className={cn("text-text-200", labelClassName)}>
        {label}
      </Text>
      {shouldDisplayPlaceholder ? (
        <Text variant="body" as="span" className={cn("text-text-300 pl-[0.5px]", placeholderClassName)}>
          {placeholder}
        </Text>
      ) : shouldTruncate ? (
        <div data-ignore-test={isValueIgnoreTest || undefined} className="w-full min-w-0">
          <TruncatedTextPopover
            text={value as React.ReactNode}
            maxLength={maxLength}
            className={cn("text-text-300 text-base font-medium leading-normal pl-[0.5px]", valueClassName)}
          />
        </div>
      ) : (
        <Text
          variant="titleSm"
          as="span"
          data-ignore-test={isValueIgnoreTest}
          className={cn("block w-full min-w-0 pl-[0.5px]", valueClassName)}
        >
          {value}
        </Text>
      )}
    </div>
  );
}
