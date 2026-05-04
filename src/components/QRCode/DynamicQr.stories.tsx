import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { DynamicQrProgress } from "@/components/QRCode/DynamicQrProgress.tsx";
import { useQRCode } from "@/hooks/useQRCode.ts";
import {
  DYNAMIC_QR_MIN_LENGTH,
  type DynamicQrLoopController,
  DynamicQrAssembler,
  createDynamicQrFrameLoop,
  getDynamicQrFrameIndex,
  parseDynamicQrChunk,
  splitIntoDynamicQrFrames,
} from "@/lib/dynamic-qr.ts";

interface DynamicQrStoryDemoProps {
  value: string;
  chunkSize: number;
  intervalMs: number;
  autoStart: boolean;
}

const demoPayload = Array.from({ length: 48 }, (_, index) => `bitcredit:token:${String(index).padStart(2, "0")}:demo-payload`)
  .join("|")
  .repeat(2);

function DynamicQrStoryDemoContent({ value, chunkSize, intervalMs, autoStart }: DynamicQrStoryDemoProps) {
  const frames = React.useMemo(() => splitIntoDynamicQrFrames(value, { chunkSize }), [value, chunkSize]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const controllerRef = React.useRef<DynamicQrLoopController | null>(null);
  const visibleFrameIndex = getDynamicQrFrameIndex(frames.length, currentIndex);
  const currentFrame = frames[visibleFrameIndex] ?? "";

  React.useEffect(() => {
    const controller = createDynamicQrFrameLoop(
      frames,
      (_frame, index) => {
        setCurrentIndex(index);
      },
      { intervalMs, autoStart }
    );

    controllerRef.current = controller;

    return () => {
      controller.stop();

      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    };
  }, [frames, intervalMs, autoStart]);

  const assembledValue = React.useMemo(() => {
    const assembler = new DynamicQrAssembler();

    return frames.reduce<string | null>((result, frame) => {
      if (result) {
        return result;
      }

      const chunk = parseDynamicQrChunk(frame);
      return chunk ? assembler.addChunk(chunk) : null;
    }, null);
  }, [frames]);

  const { qrImageUrl, qrGenerationFailed } = useQRCode({
    value: currentFrame,
    width: 220,
    margin: 1,
  });

  const isMultiFrame = value.length >= DYNAMIC_QR_MIN_LENGTH;

  return (
    <div className="max-w-4xl space-y-4 rounded-xl border border-divider-50 bg-elevation-100 p-5 text-text-300">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Dynamic QR preview</h2>
        <p className="text-sm text-text-200">
          Payload length: <span className="font-medium text-text-300">{value.length}</span> characters · Frames: <span className="font-medium text-text-300">{frames.length}</span>
        </p>
        <p className="text-sm text-text-200">
          Recommended dynamic threshold: <span className="font-medium text-text-300">{DYNAMIC_QR_MIN_LENGTH}</span> characters · Status: <span className="font-medium text-text-300">{isMultiFrame ? "multi-frame" : "single-frame"}</span>
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-divider-50 bg-elevation-200 p-4">
          {qrImageUrl && !qrGenerationFailed ? (
            <img src={qrImageUrl} alt={`Dynamic QR frame ${visibleFrameIndex + 1}`} className="h-[220px] w-[220px] rounded-lg bg-white p-2" />
          ) : (
            <div className="flex h-[220px] w-[220px] items-center justify-center rounded-lg border border-dashed border-divider-100 bg-elevation-100 text-sm text-text-200">
              Unable to render QR frame
            </div>
          )}

          <div className="w-full space-y-2">
            <DynamicQrProgress currentFrameIndex={visibleFrameIndex} totalFrames={frames.length} className="mx-auto" />
            <div className="text-center text-xs text-text-200">Scanning progress</div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              className="rounded-md border border-divider-50 bg-elevation-100 px-3 py-1.5 text-sm font-medium"
              onClick={() => controllerRef.current?.start()}
            >
              Start
            </button>
            <button
              type="button"
              className="rounded-md border border-divider-50 bg-elevation-100 px-3 py-1.5 text-sm font-medium"
              onClick={() => controllerRef.current?.stop()}
            >
              Stop
            </button>
            <button
              type="button"
              className="rounded-md border border-divider-50 bg-elevation-100 px-3 py-1.5 text-sm font-medium"
              onClick={() => {
                controllerRef.current?.reset();
                setCurrentIndex(0);
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-divider-50 bg-elevation-200 p-4">
            <div className="mb-2 text-sm font-medium">Current frame payload</div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-md bg-elevation-100 p-3 text-xs leading-5 text-text-200">
              {currentFrame}
            </pre>
          </div>

          <div className="rounded-xl border border-divider-50 bg-elevation-200 p-4">
            <div className="mb-2 text-sm font-medium">Reassembly check</div>
            <div className="text-sm text-text-200">
              Successfully reconstructed original payload: <span className="font-medium text-text-300">{assembledValue === value ? "yes" : "no"}</span>
            </div>
          </div>

          <div className="rounded-xl border border-divider-50 bg-elevation-200 p-4">
            <div className="mb-3 text-sm font-medium">All generated frames</div>
            <div className="space-y-2">
              {frames.map((frame, index) => (
                <div key={frame} className="rounded-md bg-elevation-100 p-3 text-xs leading-5 text-text-200">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-text-300">Frame {index + 1}</div>
                  <code className="whitespace-pre-wrap break-all">{frame}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DynamicQrStoryDemo(props: DynamicQrStoryDemoProps) {
  const storyKey = `${props.value}:${props.chunkSize}:${props.intervalMs}:${String(props.autoStart)}`;

  return <DynamicQrStoryDemoContent key={storyKey} {...props} />;
}

const meta = {
  title: "Components/DynamicQr",
  component: DynamicQrStoryDemo,
  args: {
    value: demoPayload,
    chunkSize: 180,
    intervalMs: 600,
    autoStart: true,
  },
} satisfies Meta<typeof DynamicQrStoryDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LoopingFrames: Story = {};

export const SingleFramePayload: Story = {
  args: {
    value: "bitcredit:token:demo-single-frame",
    chunkSize: 180,
    autoStart: false,
  },
};
