import { CircleCheckIcon, SquareArrowOutUpRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { TruncatedTextPopover } from "@/components/TruncatedText/TruncatedTextPopover";
import { AppIcon } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";

type BinaryFileResponse = {
  data: ArrayLike<number>;
  content_type?: string;
};

type GetFileWithId = (id: string, file_name: string) => Promise<BinaryFileResponse>;
type GetFileWithoutId = (file_name: string) => Promise<BinaryFileResponse>;

type AttachmentProps = {
  id?: string;
  fileName: string;
  getFile: GetFileWithId | GetFileWithoutId;
  className?: string;
  disabled?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  onOpeningChange?: (opening: boolean) => void;
};

export function Attachment({ id, fileName, getFile, className, disabled, onLoadingChange, onOpeningChange }: AttachmentProps) {
  const [fileSize, setFileSize] = useState(0);
  const [url, setUrl] = useState("");
  const [isOpening, setIsOpening] = useState(false);
  const openingTimeoutRef = useRef<number | null>(null);
  const onLoadingChangeRef = useRef(onLoadingChange);
  const onOpeningChangeRef = useRef(onOpeningChange);

  useEffect(() => {
    onLoadingChangeRef.current = onLoadingChange;
  }, [onLoadingChange]);
  useEffect(() => {
    onOpeningChangeRef.current = onOpeningChange;
  }, [onOpeningChange]);

  useEffect(() => {
    onLoadingChangeRef.current?.(true);

    const retrieveFile = async () => {
      try {
        let response: BinaryFileResponse;

        if (id && getFile.length === 2) {
          response = await (getFile as GetFileWithId)(id, fileName);
        } else {
          response = await (getFile as GetFileWithoutId)(fileName);
        }

        const blob = new Blob([new Uint8Array(response.data)], {
          type: response.content_type || "application/octet-stream",
        });

        setFileSize(Math.round(blob.size / 1024));
        setUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Failed to download file:", error);
      } finally {
        onLoadingChangeRef.current?.(false);
      }
    };

    void retrieveFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (openingTimeoutRef.current !== null) {
        window.clearTimeout(openingTimeoutRef.current);
      }
    };
  }, []);

  const openFile = () => {
    if (!url) return;

    setIsOpening(true);
    onOpeningChangeRef.current?.(true);
    window.open(url, "_blank", "noopener,noreferrer");

    openingTimeoutRef.current = window.setTimeout(() => {
      setIsOpening(false);
      onOpeningChangeRef.current?.(false);
      openingTimeoutRef.current = null;
    }, 2000);
  };

  return (
    <div className={cn("flex items-center justify-between p-4 bg-elevation-200 border border-divider-50 rounded-lg", className)}>
      <div className="flex gap-1 items-center min-w-0 flex-1">
        <TruncatedTextPopover
          text={fileName}
          maxLength={32}
          className="text-text-300 text-sm font-medium leading-5 text-left"
          contentClassName="text-left"
        />
        <span className="shrink-0 text-text-200 text-xs font-normal leading-normal">{fileSize} KB</span>
        <AppIcon icon={CircleCheckIcon} className="shrink-0 text-signal-success" />
      </div>
      <button
        type="button"
        className="shrink-0 p-1 !bg-transparent disabled:cursor-not-allowed disabled:opacity-40"
        onClick={openFile}
        aria-label={`Open ${fileName}`}
        disabled={!url || isOpening || disabled}
      >
        {isOpening ? (
          <span className="text-xs text-text-200">Opening...</span>
        ) : (
          <AppIcon icon={SquareArrowOutUpRightIcon} className="text-text-200" />
        )}
      </button>
    </div>
  );
}
