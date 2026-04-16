/* eslint-disable import/no-default-export */
import { FormattedMessage } from "react-intl";
import { UploadIcon } from "lucide-react";

import { AppIcon } from "@/components/ui/app-icon";

function Upload() {
  return (
    <div className="flex items-center gap-3 w-full py-3 px-4 border border-divider-75 border-dashed rounded-lg cursor-pointer">
      <div className="flex items-center justify-center bg-brand-50 w-10 h-10 rounded-full">
        <AppIcon icon={UploadIcon} className="text-brand-200" size="md" />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-text-300 text-sm font-medium">
          <FormattedMessage id="Upload document" defaultMessage="Upload document" description="Upload files placeholder" />
        </span>

        <span className="text-text-200 text-xs font-normal">PDF, PNG or JPG (max. 10 MB)</span>
      </div>
    </div>
  );
}

export { Upload };
export default Upload;
