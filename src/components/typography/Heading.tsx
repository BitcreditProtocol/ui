import React from "react";

import { cn } from "@/lib/utils";

type HeadingVariant = "page" | "section" | "sub";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps<T extends HeadingTag> = {
  as?: T;
  variant?: HeadingVariant;
  className?: string;
  "data-ignore-test"?: boolean;
} & Omit<React.ComponentPropsWithoutRef<T>, "className">;

const variantClasses: Record<HeadingVariant, string> = {
  page: "text-text-300 text-2xl font-medium leading-[38px]",
  section: "text-text-300 text-xl font-medium leading-7",
  sub: "text-text-300 text-base font-medium leading-normal",
};

const defaultTags: Record<HeadingVariant, HeadingTag> = {
  page: "h1",
  section: "h2",
  sub: "h3",
};

export function Heading<T extends HeadingTag = "h2">({
  as,
  variant = "section",
  className,
  "data-ignore-test": isDataIgnoreTest,
  ...props
}: HeadingProps<T>) {
  const Component = as ?? defaultTags[variant];

  return <Component data-ignore-test={isDataIgnoreTest || undefined} className={cn(variantClasses[variant], className)} {...props} />;
}
