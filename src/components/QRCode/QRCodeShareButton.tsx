import { ShareIcon } from "lucide-react";
import { toCanvas } from "qrcode";
import React from "react";

import { useUiText } from "@/components/context/i18n/useUiText";
import { AppIcon } from "@/components/ui/app-icon";
import type { UiMessages, UiT } from "@/lib/ui-i18n";

const componentMessages: UiMessages = {
  "ui.qrCodeShareButton.ariaLabel": "Share QR code",
  "ui.qrCodeShareButton.defaultShareText": "My Bitcredit ecash token:",
  "ui.qrCodeShareButton.sharedSuccessfully": "Shared successfully!",
  "ui.qrCodeShareButton.qrCodeDownloaded": "QR code downloaded!",
  "ui.qrCodeShareButton.tokenCopied": "Token copied to clipboard!",
  "ui.qrCodeShareButton.failedToShare": "Failed to share token",
};

export interface QRCodeShareButtonProps {
  value: string;
  tokenText?: string;
  filename?: string;
  shareTitle?: string;
  shareText?: string;
  label?: React.ReactNode;
  variant?: "icon" | "withLabel";
  qrWidth?: number;
  qrMargin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onFallback?: () => void;
  qrImageUrl?: string;
  qrGenerationFailed?: boolean;
  className?: string;
  disabled?: boolean;
  messages?: UiMessages;
  t?: UiT;
}

export const QRCodeShareButton: React.FC<QRCodeShareButtonProps> = ({
  value,
  tokenText,
  filename = "qrcode.png",
  shareTitle,
  shareText,
  label,
  variant = label ? "withLabel" : "icon",
  qrWidth = 480,
  qrMargin = 5,
  errorCorrectionLevel = "M",
  onSuccess,
  onError,
  onFallback,
  qrImageUrl,
  qrGenerationFailed: hasQrGenerationFailed = false,
  className = "",
  disabled: isDisabled = false,
  messages,
  t,
}) => {
  const uiText = useUiText();
  const resolvedMessages = { ...componentMessages, ...messages };

  const ui = (key: keyof typeof componentMessages) => uiText({ key, messages: resolvedMessages, t });

  const handleShare = async () => {
    if (!value || typeof window === "undefined") {
      return;
    }

    const actualTokenText = tokenText || value;

    try {
      const shareData: ShareData = {};

      if (shareTitle) {
        shareData.title = shareTitle;
      }

      const baseMsg = shareText ?? ui("ui.qrCodeShareButton.defaultShareText");
      shareData.text = `${baseMsg}\n\n${actualTokenText}`;

      let file: File | null = null;
      let dataUrl = qrImageUrl;

      if (!hasQrGenerationFailed) {
        try {
          if (qrImageUrl) {
            const response = await fetch(qrImageUrl);
            const blob = await response.blob();
            file = new File([blob], filename, { type: "image/png" });
            dataUrl = qrImageUrl;
          } else {
            const canvas = document.createElement("canvas");
            await toCanvas(canvas, value, {
              width: qrWidth,
              margin: qrMargin,
              errorCorrectionLevel,
            });

            const blob: Blob = await new Promise((resolve, reject) => {
              canvas.toBlob((b) => {
                if (b) {
                  resolve(b);
                } else {
                  reject(new Error("toBlob failed"));
                }
              }, "image/png");
            });

            file = new File([blob], filename, { type: "image/png" });
            dataUrl = canvas.toDataURL("image/png");
          }

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            shareData.files = [file];
          }
        } catch (error) {
          console.error("Error generating/fetching QR code for sharing:", error);
          throw error;
        }
      }

      if (navigator.share) {
        await navigator.share(shareData);
        onSuccess?.(ui("ui.qrCodeShareButton.sharedSuccessfully"));
      } else {
        if (dataUrl && !hasQrGenerationFailed) {
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = filename;
          a.click();
          onFallback?.();
          onSuccess?.(ui("ui.qrCodeShareButton.qrCodeDownloaded"));
        } else {
          await navigator.clipboard.writeText(actualTokenText);
          onFallback?.();
          onSuccess?.(ui("ui.qrCodeShareButton.tokenCopied"));
        }
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }

      if (qrImageUrl && !hasQrGenerationFailed) {
        try {
          const a = document.createElement("a");
          a.href = qrImageUrl;
          a.download = filename;
          a.click();
          onFallback?.();
          onSuccess?.(ui("ui.qrCodeShareButton.qrCodeDownloaded"));
        } catch (downloadError) {
          console.error("Error downloading QR code:", downloadError);
          onError?.(ui("ui.qrCodeShareButton.failedToShare"));
        }
      } else {
        onError?.(ui("ui.qrCodeShareButton.failedToShare"));
      }
    }
  };

  const baseVariantClasses =
    variant === "icon"
      ? "flex flex-col items-center justify-center h-8 w-8 bg-elevation-200 border border-divider-50 rounded-md cursor-pointer"
      : "flex items-center justify-center p-2 bg-elevation-200 border border-divider-50 rounded-md";

  const disabledClasses = isDisabled ? "opacity-40 cursor-not-allowed" : "";

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      onClick={() => {
        void handleShare();
      }}
      className={`${baseVariantClasses} ${disabledClasses} ${className}`.trim()}
      aria-label={shareTitle || ui("ui.qrCodeShareButton.ariaLabel")}
      title={shareTitle || ui("ui.qrCodeShareButton.ariaLabel")}
    >
      <AppIcon icon={ShareIcon} className="text-text-300" size="md" />
      {label && variant === "withLabel" ? <span className="text-text-300 text-sm font-medium pl-2">{label}</span> : null}
    </button>
  );
};
