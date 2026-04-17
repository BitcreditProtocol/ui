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

type HeadingTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  "data-ignore-test"?: boolean;
};

type HeadingDescriptionProps = React.HTMLAttributes<HTMLSpanElement> & {
  "data-ignore-test"?: boolean;
};

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

export function HeadingTitle({ className, "data-ignore-test": isDataIgnoreTest, ...props }: HeadingTitleProps) {
  return <h1 data-ignore-test={isDataIgnoreTest || undefined} className={cn("text-text-300 text-2xl font-medium leading-8", className)} {...props} />;
}

export function HeadingDescription({ className, "data-ignore-test": isDataIgnoreTest, ...props }: HeadingDescriptionProps) {
  return <span data-ignore-test={isDataIgnoreTest || undefined} className={cn("text-text-200 text-base font-normal leading-6", className)} {...props} />;
}

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

Heading.Title = HeadingTitle;
Heading.Description = HeadingDescription;
