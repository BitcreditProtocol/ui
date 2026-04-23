import { UploadIcon } from "lucide-react";
import { useUiText } from "@/components/context/i18n/useUiText";
import { AppIcon } from "@/components/ui/app-icon";
import type { UiMessages, UiT } from "@/lib/ui-i18n";

type UploadProps = {
  description?: string;
  messages?: UiMessages;
  t?: UiT;
};

function Upload({ description = "PDF, PNG or JPG (max. 10 MB)", messages, t }: UploadProps) {
  const uiText = useUiText();

  return (
    <div className="flex items-center gap-3 w-full py-3 px-4 border border-divider-75 border-dashed rounded-lg cursor-pointer">
      <div className="flex items-center justify-center bg-brand-50 w-10 h-10 rounded-full">
        <AppIcon icon={UploadIcon} className="text-brand-200" size="md" />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-text-300 text-sm font-medium">
          {uiText({
            key: "ui.upload.label",
            legacyKey: "ui.upload.label",
            messages,
            t,
          })}
        </span>

        <span className="text-text-200 text-xs font-normal">{description}</span>
      </div>
    </div>
  );
}

export { Upload };
