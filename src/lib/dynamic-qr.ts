export const DYNAMIC_QR_PREFIX = "BCQR";
export const DEFAULT_DYNAMIC_QR_CHUNK_SIZE = 500;
export const DYNAMIC_QR_MIN_LENGTH = DEFAULT_DYNAMIC_QR_CHUNK_SIZE;
export const DEFAULT_DYNAMIC_QR_INTERVAL_MS = 400;

export interface DynamicQrConfig {
  prefix?: string;
  defaultChunkSize?: number;
  minLength?: number;
  defaultIntervalMs?: number;
}

export interface SplitDynamicQrFramesOptions {
  chunkSize: number;
  prefix?: string;
}

export interface CreateDynamicQrLoopOptions {
  intervalMs?: number;
  autoStart?: boolean;
}

export interface DynamicQrLoopController {
  readonly frames: readonly string[];
  readonly intervalMs: number;
  readonly isRunning: boolean;
  readonly currentIndex: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export class DynamicQrChunk {
  readonly totalChunks: number;
  readonly index: number;
  readonly payload: string;
  readonly prefix: string;

  constructor(
    totalChunks: number,
    index: number,
    payload: string,
    prefix: string = DYNAMIC_QR_PREFIX
  ) {
    this.totalChunks = totalChunks;
    this.index = index;
    this.payload = payload;
    this.prefix = prefix;
  }

  toFrame(): string {
    return `${this.prefix}:${String(this.totalChunks)}:${String(this.index)}:${this.payload}`;
  }
}

export const isDynamicQrChunk = (value: string, config?: DynamicQrConfig): boolean => {
  const prefix = config?.prefix ?? DYNAMIC_QR_PREFIX;
  return value.startsWith(`${prefix}:`);
};

export function parseDynamicQrChunk(value: string, config?: DynamicQrConfig): DynamicQrChunk | null {
  const prefix = config?.prefix ?? DYNAMIC_QR_PREFIX;

  if (!isDynamicQrChunk(value, config)) {
    return null;
  }

  const firstColon = value.indexOf(":");
  const secondColon = value.indexOf(":", firstColon + 1);
  const thirdColon = value.indexOf(":", secondColon + 1);

  if (firstColon === -1 || secondColon === -1 || thirdColon === -1) {
    return null;
  }

  const totalChunks = Number.parseInt(value.substring(firstColon + 1, secondColon), 10);
  const index = Number.parseInt(value.substring(secondColon + 1, thirdColon), 10);

  if (!Number.isInteger(totalChunks) || !Number.isInteger(index)) {
    return null;
  }

  if (totalChunks <= 0 || index < 0 || index >= totalChunks) {
    return null;
  }

  const payload = value.substring(thirdColon + 1);

  return new DynamicQrChunk(totalChunks, index, payload, prefix);
}

export class DynamicQrAssembler {
  private expectedTotal: number | null = null;
  private readonly chunks = new Map<number, string>();

  reset(): void {
    this.expectedTotal = null;
    this.chunks.clear();
  }

  addChunk(chunk: DynamicQrChunk): string | null {
    const isDifferentSequence = this.expectedTotal !== null && this.expectedTotal !== chunk.totalChunks;

    if (isDifferentSequence) {
      this.reset();
    }

    this.expectedTotal = chunk.totalChunks;
    this.chunks.set(chunk.index, chunk.payload);

    if (this.chunks.size !== this.expectedTotal) {
      return null;
    }

    let result = "";

    for (let index = 0; index < this.expectedTotal; index += 1) {
      const part = this.chunks.get(index);
      if (part == null) {
        return null;
      }

      result += part;
    }

    this.reset();
    return result;
  }

  get receivedCount(): number {
    return this.chunks.size;
  }

  get receivedIndices(): Set<number> {
    return new Set(this.chunks.keys());
  }

  get totalChunks(): number | null {
    return this.expectedTotal;
  }
}

export function splitIntoDynamicQrFrames(value: string, options: SplitDynamicQrFramesOptions): string[] {
  const { chunkSize, prefix = DYNAMIC_QR_PREFIX } = options;

  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new Error("chunkSize must be a positive integer");
  }

  const payloadChunks =
    value.length === 0
      ? [""]
      : Array.from({ length: Math.ceil(value.length / chunkSize) }, (_, index) =>
          value.slice(index * chunkSize, (index + 1) * chunkSize)
        );

  return payloadChunks.map((payload, index) =>
    new DynamicQrChunk(payloadChunks.length, index, payload, prefix).toFrame()
  );
}

export function shouldUseDynamicQr(value: string, chunkSize: number): boolean {
  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new Error("chunkSize must be a positive integer");
  }

  return value.length > chunkSize;
}

export function getDynamicQrFrameIndex(totalFrames: number, frameIndex: number): number {
  if (!Number.isInteger(totalFrames) || totalFrames <= 0) {
    return 0;
  }

  return ((frameIndex % totalFrames) + totalFrames) % totalFrames;
}

export function createDynamicQrFrameLoop(
  frames: readonly string[],
  onFrame: (frame: string, index: number) => void,
  options: CreateDynamicQrLoopOptions = {}
): DynamicQrLoopController {
  if (frames.length === 0) {
    throw new Error("frames must not be empty");
  }

  const intervalMs = options.intervalMs ?? DEFAULT_DYNAMIC_QR_INTERVAL_MS;

  if (!Number.isInteger(intervalMs) || intervalMs <= 0) {
    throw new Error("intervalMs must be a positive integer");
  }

  let currentIndex = 0;
  let timerId: ReturnType<typeof globalThis.setInterval> | null = null;

  const emitCurrentFrame = () => {
    onFrame(frames[currentIndex], currentIndex);
  };

  const stop = () => {
    if (timerId !== null) {
      globalThis.clearInterval(timerId);
      timerId = null;
    }
  };

  const start = () => {
    if (timerId !== null) {
      return;
    }

    emitCurrentFrame();

    timerId = globalThis.setInterval(() => {
      currentIndex = getDynamicQrFrameIndex(frames.length, currentIndex + 1);
      emitCurrentFrame();
    }, intervalMs);
  };

  const reset = () => {
    stop();
    currentIndex = 0;
  };

  if (options.autoStart ?? true) {
    start();
  }

  return {
    frames,
    intervalMs,
    get isRunning() {
      return timerId !== null;
    },
    get currentIndex() {
      return currentIndex;
    },
    start,
    stop,
    reset,
  };
}
