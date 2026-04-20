import { toCanvas } from "qrcode";
import { useEffect, useState } from "react";

interface UseQRCodeOptions {
  value?: string;
  width?: number;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  maxLength?: number;
}

/**
 * Custom hook for generating QR codes
 */
export function useQRCode({ value, width = 800, margin = 4, errorCorrectionLevel = "M", maxLength = 2956 }: UseQRCodeOptions) {
  const [generatedQrImageUrl, setGeneratedQrImageUrl] = useState("");
  const [hasQrGenerationFailedFromRender, setHasQrGenerationFailedFromRender] = useState(false);
  const isQrCodeTooLong = (value?.length ?? 0) > maxLength;
  const qrImageUrl = value && !isQrCodeTooLong ? generatedQrImageUrl : "";
  const hasQrGenerationFailed = isQrCodeTooLong || hasQrGenerationFailedFromRender;
  const markQrFailure = () => {
    queueMicrotask(() => {
      setHasQrGenerationFailedFromRender(true);
      setGeneratedQrImageUrl("");
    });
  };

  useEffect(() => {
    if (!value || isQrCodeTooLong) {
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        markQrFailure();
        return;
      }

      void toCanvas(canvas, value, {
        width,
        margin,
        errorCorrectionLevel,
      })
        .then(() => {
          const url = canvas.toDataURL("image/png");
          setHasQrGenerationFailedFromRender(false);
          setGeneratedQrImageUrl(url);
        })
        .catch(() => {
          markQrFailure();
        });
    } catch {
      markQrFailure();
    }
  }, [value, isQrCodeTooLong, width, margin, errorCorrectionLevel]);

  return {
    qrImageUrl,
    qrGenerationFailed: hasQrGenerationFailed,
    isQrCodeTooLong,
  };
}
