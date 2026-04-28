import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useUiText } from "@/components/context/i18n/useUiText";
import { AppIcon } from "@/components/ui/app-icon";
import { Button, type ButtonProps } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast.ts";
import type { UiMessages, UiT } from "@/lib/ui-i18n";

async function copyToClipboard(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  throw new Error("Clipboard API is not available");
}

type CopyToClipboardButtonProps = {
  value: string;
  onCopy?: () => void;
  label?: string;
  showCheckmark?: boolean;
  t?: UiT;
  messages?: UiMessages;
} & Omit<ButtonProps, "onCopy">;

export function CopyToClipboardButton({
  value,
  onCopy,
  label,
  showCheckmark = false,
  t,
  messages,
  variant = "ghost",
  size = "xxs",
  type = "button",
  className,
  onClick,
  ...props
}: CopyToClipboardButtonProps) {
  const uiText = useUiText();
  const [copied, setCopied] = useState(false);
  const resetTimeoutRef = useRef<number | null>(null);
  const labelValue =
    label ??
    uiText({
      key: "ui.copyToClipboard.valueLabel",
      legacyKey: "action.copyToClipboard.label",
      messages,
      t,
    });

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Button
      aria-label={uiText({
        key: "ui.copyToClipboard.ariaLabel",
        legacyKey: "action.copyToClipboard.ariaLabel",
        messages,
        t,
      })}
      className={className}
      size={size}
      type={type}
      variant={variant}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }

        void copyToClipboard(value)
          .then(() => {
            onCopy?.();

            if (showCheckmark) {
              setCopied(true);
              if (resetTimeoutRef.current !== null) {
                window.clearTimeout(resetTimeoutRef.current);
              }
              resetTimeoutRef.current = window.setTimeout(() => {
                setCopied(false);
                resetTimeoutRef.current = null;
              }, 2000);
            }

            toast({
              title: uiText({
                key: "ui.copyToClipboard.successTitle",
                legacyKey: "action.copyToClipboard.title",
                messages,
                t,
              }),
              description: uiText({
                key: "ui.copyToClipboard.successDescription",
                legacyKey: "action.copyToClipboard.description",
                params: { label: labelValue },
                messages,
                t,
              }),
              position: "top-center",
              duration: 2500,
            });
          })
          .catch(() => {
            toast({
              title: uiText({
                key: "ui.copyToClipboard.errorTitle",
                legacyKey: "action.copyToClipboard.errorTitle",
                messages,
                t,
              }),
              description: uiText({
                key: "ui.copyToClipboard.errorDescription",
                legacyKey: "action.copyToClipboard.errorDescription",
                params: { label: labelValue },
                messages,
                t,
              }),
              variant: "error",
              position: "top-center",
              duration: 2500,
            });
          });
      }}
      {...props}
    >
      <AppIcon icon={copied && showCheckmark ? CheckIcon : CopyIcon} className="text-current" size={size === "lg" ? "md" : "sm"} />
    </Button>
  );
}
