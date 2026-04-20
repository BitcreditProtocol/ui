import { CopyIcon } from "lucide-react";
import { useIntl } from "react-intl";

import { AppIcon } from "@/components/ui/app-icon.tsx";
import { toast } from "@/hooks/use-toast.ts";
import { cn } from "@/lib/utils.ts";

async function copyToClipboard(value: string, onSuccess?: () => void) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    onSuccess?.();
    return;
  }

  if (typeof document === "undefined") {
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  onSuccess?.();
}

type CopyToClipboardButtonProps = {
  value: string;
  onCopy?: () => void;
} & React.HTMLAttributes<HTMLButtonElement>;

export function CopyToClipboardButton({ value, onCopy, className, ...props }: CopyToClipboardButtonProps) {
  const { formatMessage: f } = useIntl();

  return (
    <button
      aria-label={f({
        id: "action.copyToClipboard.ariaLabel",
        defaultMessage: "Copy to clipboard",
      })}
      className={cn("flex items-center justify-center p-0 !bg-transparent cursor-pointer", className)}
      onClick={() => {
        void copyToClipboard(value, () => {
          onCopy?.();

          toast({
            title: f({
              id: "action.copyToClipboard.title",
              defaultMessage: "Success!",
            }),
            description: f({
              id: "action.copyToClipboard.description",
              defaultMessage: "Copied to clipboard!",
            }),
            position: "top-center",
            duration: 2500,
          });
        });
      }}
      {...props}
    >
      <AppIcon icon={CopyIcon} className="text-text-200" />
    </button>
  );
}
