import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { Button, type ButtonProps } from "@/components/ui/button.tsx";
import { AppIcon } from "@/components/ui/app-icon.tsx";
import { toast } from "@/hooks/use-toast.ts";

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
} & Omit<ButtonProps, "onCopy">;

export function CopyToClipboardButton({
  value,
  onCopy,
  label,
  showCheckmark = false,
  variant = "ghost",
  size = "xxs",
  className,
  ...props
}: CopyToClipboardButtonProps) {
  const { formatMessage: f } = useIntl();
  const [copied, setCopied] = useState(false);
  const resetTimeoutRef = useRef<number | null>(null);
  const labelValue =
    label ??
    f({
      id: "action.copyToClipboard.label",
      defaultMessage: "Value",
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
      aria-label={f({
        id: "action.copyToClipboard.ariaLabel",
        defaultMessage: "Copy to clipboard",
      })}
      className={className}
      size={size}
      variant={variant}
      onClick={() => {
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
              title: f({
                id: "action.copyToClipboard.title",
                defaultMessage: "Success!",
              }),
              description: f(
                {
                  id: "action.copyToClipboard.description",
                  defaultMessage: "{label} copied to clipboard!",
                },
                { label: labelValue }
              ),
              position: "top-center",
              duration: 2500,
            });
          })
          .catch(() => {
            toast({
              title: f({
                id: "action.copyToClipboard.errorTitle",
                defaultMessage: "Copy failed",
              }),
              description: f(
                {
                  id: "action.copyToClipboard.errorDescription",
                  defaultMessage: "Failed to copy {label}.",
                },
                { label: labelValue }
              ),
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
