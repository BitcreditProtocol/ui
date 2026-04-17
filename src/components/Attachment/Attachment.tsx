import { CircleCheckIcon, SquareArrowOutUpRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { TruncatedTextPopover } from "@/components/TruncatedText/TruncatedTextPopover";
import { AppIcon } from "@/components/ui/app-icon.tsx";

type BinaryFileResponse = {
  data: ArrayLike<number>;
  content_type?: string;
};

type GetFileWithId = (id: string, file_name: string) => Promise<BinaryFileResponse>;
type GetFileWithoutId = (file_name: string) => Promise<BinaryFileResponse>;

export function Attachment({ id, fileName, getFile }: { id?: string; fileName: string; getFile: GetFileWithId | GetFileWithoutId }) {
  const [fileSize, setFileSize] = useState(0);
  const [url, setUrl] = useState("");

  useEffect(() => {
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

        const url = URL.createObjectURL(blob);

        setUrl(url);
      } catch (error) {
        console.error("Failed to download file:", error);
      }
    };

    void retrieveFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openFile = () => {
    if (!url) {
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center justify-between p-4 bg-elevation-200 border border-divider-50 rounded-lg">
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
        disabled={!url}
      >
        <AppIcon icon={SquareArrowOutUpRightIcon} className="text-text-200" />
      </button>
    </div>
  );
}
