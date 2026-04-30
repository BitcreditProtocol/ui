import { CopyToClipboardButton } from "@/components/CopyToClipboardButton";
import { TruncatedTextPopover } from "@/components/TruncatedText/TruncatedTextPopover";
import { cn } from "@/lib/utils";

type NodeIdDisplayProps = {
  nodeId: string;
  maxLength?: number;
  className?: string;
  textClassName?: string;
  copyButtonClassName?: string;
  hideCopyButton?: boolean;
};

export function NodeIdDisplay({ nodeId, maxLength = 22, className, textClassName, copyButtonClassName, hideCopyButton = false }: NodeIdDisplayProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <TruncatedTextPopover
        text={nodeId}
        maxLength={maxLength}
        as="button"
        truncationMode="middle"
        className={cn("text-text-200 text-xs font-normal leading-[18px] !bg-transparent !p-0 !text-text-200", textClassName)}
      />
      {!hideCopyButton && <CopyToClipboardButton value={nodeId} className={cn("shrink-0 !p-0 text-text-200", copyButtonClassName)} />}
    </div>
  );
}
