import React from "react";

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

const truncateText = (value: React.ReactNode | string, maxLength?: number) => {
  if (typeof value !== "string") {
    return value;
  }

  if (!maxLength || value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
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
      ) : (
        <Text
          variant="titleSm"
          as="span"
          data-ignore-test={isValueIgnoreTest}
          className={cn("block w-full min-w-0 pl-[0.5px]", valueClassName)}
          title={shouldTruncate && typeof value === "string" ? value : undefined}
        >
          {shouldTruncate ? truncateText(value, maxLength) : value}
        </Text>
      )}
    </div>
  );
}
