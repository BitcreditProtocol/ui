import { ChevronRightIcon } from "lucide-react";
import React from "react";

import { Text } from "@/components/typography/Text";
import { AppIcon } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";

type MenuOptionProps = {
  icon: React.ReactNode;
  label: string;
  defaultValue?: string;
  disabled?: boolean;
};

export default function MenuOption({ icon, label, defaultValue, disabled: isDisabled }: MenuOptionProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* The row icon sits in a 32px tile; any icon passed in is sized to the 20px the design uses. */}
        <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-divider-75 bg-elevation-50 [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </span>
        <Text variant="titleSm" as="span" className={cn("text-text-300 leading-6", isDisabled && "text-text-100")}>
          {label}
        </Text>
      </div>

      <div className="flex items-center gap-2">
        {defaultValue && (
          <Text variant="caption" as="span" className={cn("text-text-200 leading-5", isDisabled && "text-text-100")}>
            {defaultValue}
          </Text>
        )}
        <AppIcon icon={ChevronRightIcon} className={cn("text-text-300 h-5 w-5 stroke-1", isDisabled && "text-text-100")} />
      </div>
    </div>
  );
}
