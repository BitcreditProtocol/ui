import { cn } from "@/lib/utils.ts";

export interface DynamicQrProgressProps {
  currentFrameIndex: number;
  totalFrames: number;
  className?: string;
}

export function DynamicQrProgress({ currentFrameIndex, totalFrames, className = "" }: DynamicQrProgressProps) {
  const currentFrame = totalFrames > 0 ? Math.min(Math.max(currentFrameIndex + 1, 0), totalFrames) : 0;
  const progress = totalFrames > 0 ? (currentFrame / totalFrames) * 100 : 0;

  return (
    <div className={cn("w-40 max-w-full", className)}>
      <div
        role="progressbar"
        aria-label="Animated QR progress"
        aria-valuemin={0}
        aria-valuemax={totalFrames}
        aria-valuenow={currentFrame}
        className="h-1.5 w-full overflow-hidden rounded-full bg-text-200/20"
      >
        <div
          className="h-full rounded-full bg-brand-200 transition-[width] duration-150 ease-linear"
          style={{ width: `${String(progress)}%` }}
        />
      </div>
    </div>
  );
}
