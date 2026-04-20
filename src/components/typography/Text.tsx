import React from "react";

import { cn } from "@/lib/utils";

type TextVariant = "body" | "bodyMuted" | "label" | "caption" | "micro" | "mono" | "titleLg" | "titleMd" | "titleSm";

type MonoSize = "xs" | "sm" | "md";

type TextProps<T extends React.ElementType> = {
  as?: T;
  variant?: TextVariant;
  monoSize?: MonoSize;
  className?: string;
  "data-ignore-test"?: boolean;
} & Omit<React.ComponentPropsWithoutRef<T>, "className">;

const variantClasses: Record<TextVariant, string> = {
  body: "text-text-300 text-base font-normal leading-6",
  bodyMuted: "text-text-200 text-base font-normal leading-6",
  label: "text-text-300 text-sm font-medium leading-5",
  caption: "text-text-300 text-sm font-normal leading-normal",
  micro: "text-text-200 text-[10px] font-medium leading-[14px]",
  mono: "text-text-300 font-mono font-medium",
  titleLg: "text-text-300 text-2xl font-medium leading-8",
  titleMd: "text-text-300 text-xl font-medium leading-normal",
  titleSm: "text-text-300 text-base font-medium leading-normal",
};

const monoSizeClasses: Record<MonoSize, string> = {
  xs: "text-xs leading-[14px]",
  sm: "text-sm leading-5",
  md: "text-base leading-6",
};

const defaultTags: Record<TextVariant, React.ElementType> = {
  body: "p",
  bodyMuted: "p",
  label: "span",
  caption: "span",
  micro: "span",
  mono: "span",
  titleLg: "span",
  titleMd: "span",
  titleSm: "span",
};

export function Text<T extends React.ElementType = "span">({
  as,
  variant = "body",
  monoSize = "sm",
  className,
  "data-ignore-test": isDataIgnoreTest,
  ...props
}: TextProps<T>) {
  const Component = as ?? defaultTags[variant];
  const monoClass = variant === "mono" ? monoSizeClasses[monoSize] : undefined;

  return (
    <Component data-ignore-test={isDataIgnoreTest || undefined} className={cn(variantClasses[variant], monoClass, className)} {...props} />
  );
}
