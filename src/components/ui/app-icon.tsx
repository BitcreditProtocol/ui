import type { LucideIcon, LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";

type AppIconProps = Omit<LucideProps, "ref"> & {
  icon: LucideIcon;
  label?: string;
  size?: number | "sm" | "md" | "lg";
  weight?: "thin" | "default" | "strong";
};

const iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

const iconStrokeWidths = {
  thin: 1,
  default: 1.5,
  strong: 2,
} as const;

/**
 * Shared wrapper for Lucide icons.
 * Decorative icons are hidden from assistive tech by default.
 * If `label` is provided, the icon is exposed as an image with that label.
 * for future accessibility things https://www.npmjs.com/package/eslint-plugin-jsx-a11y and https://github.com/dequelabs/axe-core-npm/tree/develop/packages/react
 */
export function AppIcon({ icon: Icon, label, size = "sm", weight = "thin", className, strokeWidth, ...props }: AppIconProps) {
  const presetSize = typeof size === "string" ? iconSizeClasses[size] : undefined;
  const iconSize = typeof size === "string" && size in iconSizeClasses ? undefined : size;
  const resolvedStrokeWidth = strokeWidth ?? iconStrokeWidths[weight];

  return (
    <Icon
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      className={cn(presetSize, className)}
      size={iconSize}
      strokeWidth={resolvedStrokeWidth}
      {...props}
    />
  );
}
