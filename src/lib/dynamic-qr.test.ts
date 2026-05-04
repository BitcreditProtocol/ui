import { afterEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_DYNAMIC_QR_CHUNK_SIZE,
  DEFAULT_DYNAMIC_QR_INTERVAL_MS,
  DYNAMIC_QR_MIN_LENGTH,
  DynamicQrAssembler,
  DynamicQrChunk,
  createDynamicQrFrameLoop,
  getDynamicQrFrameIndex,
  isDynamicQrChunk,
  parseDynamicQrChunk,
  shouldUseDynamicQr,
  splitIntoDynamicQrFrames,
} from "./dynamic-qr";

describe("dynamic-qr", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("serializes and parses a chunk frame", () => {
    const chunk = new DynamicQrChunk(3, 1, "payload:with:colons");
    const frame = chunk.toFrame();

    expect(isDynamicQrChunk(frame)).toBe(true);
    expect(parseDynamicQrChunk(frame)).toEqual(chunk);
  });

  it("rejects invalid chunk frames", () => {
    expect(parseDynamicQrChunk("not-a-frame")).toBeNull();
    expect(parseDynamicQrChunk("BCQR:two:0:payload")).toBeNull();
    expect(parseDynamicQrChunk("BCQR:2:2:payload")).toBeNull();
    expect(parseDynamicQrChunk("BCQR:0:0:payload")).toBeNull();
    expect(parseDynamicQrChunk("BCQR:2:-1:payload")).toBeNull();
  });

  it("splits values into dynamic QR frames", () => {
    expect(splitIntoDynamicQrFrames("ABCDEFGHIJ", { chunkSize: 4 })).toEqual(["BCQR:3:0:ABCD", "BCQR:3:1:EFGH", "BCQR:3:2:IJ"]);
  });

  it("creates a single empty frame for empty values", () => {
    expect(splitIntoDynamicQrFrames("", { chunkSize: 4 })).toEqual(["BCQR:1:0:"]);
  });

  it("throws for invalid chunk sizes", () => {
    expect(() => splitIntoDynamicQrFrames("ABC", { chunkSize: 0 })).toThrow("chunkSize must be a positive integer");
    expect(() => splitIntoDynamicQrFrames("ABC", { chunkSize: 2.5 })).toThrow("chunkSize must be a positive integer");
  });

  it("uses the default min-length constant as the default chunk-size threshold", () => {
    expect(DYNAMIC_QR_MIN_LENGTH).toBe(DEFAULT_DYNAMIC_QR_CHUNK_SIZE);
  });

  it("determines whether a payload should use dynamic QR based on chunk size", () => {
    expect(shouldUseDynamicQr("A".repeat(DEFAULT_DYNAMIC_QR_CHUNK_SIZE), DEFAULT_DYNAMIC_QR_CHUNK_SIZE)).toBe(false);
    expect(shouldUseDynamicQr("A".repeat(DEFAULT_DYNAMIC_QR_CHUNK_SIZE + 1), DEFAULT_DYNAMIC_QR_CHUNK_SIZE)).toBe(true);
    expect(shouldUseDynamicQr("A".repeat(180), 180)).toBe(false);
    expect(shouldUseDynamicQr("A".repeat(181), 180)).toBe(true);
  });

  it("throws when shouldUseDynamicQr receives an invalid chunk size", () => {
    expect(() => shouldUseDynamicQr("ABC", 0)).toThrow("chunkSize must be a positive integer");
    expect(() => shouldUseDynamicQr("ABC", 2.5)).toThrow("chunkSize must be a positive integer");
  });

  it("assembles parsed chunks into the original value", () => {
    const frames = splitIntoDynamicQrFrames("abcdefghijklmnopqrstuvwxyz", { chunkSize: 5 });
    const assembler = new DynamicQrAssembler();
    const chunks = [...frames].reverse().map((frame) => parseDynamicQrChunk(frame));

    expect(chunks.every((chunk) => chunk instanceof DynamicQrChunk)).toBe(true);

    const result = chunks.reduce<string | null>((assembled, chunk) => {
      if (assembled || chunk == null) {
        return assembled;
      }

      return assembler.addChunk(chunk);
    }, null);

    expect(result).toBe("abcdefghijklmnopqrstuvwxyz");
    expect(assembler.receivedCount).toBe(0);
    expect(assembler.totalChunks).toBeNull();
  });

  it("resets the assembler when a different sequence size is received", () => {
    const assembler = new DynamicQrAssembler();

    expect(assembler.addChunk(new DynamicQrChunk(3, 0, "abc"))).toBeNull();
    expect(assembler.receivedCount).toBe(1);
    expect(assembler.totalChunks).toBe(3);

    expect(assembler.addChunk(new DynamicQrChunk(2, 0, "xy"))).toBeNull();
    expect(assembler.receivedCount).toBe(1);
    expect(assembler.totalChunks).toBe(2);
    expect(assembler.receivedIndices).toEqual(new Set([0]));
  });

  it("normalizes dynamic QR frame indices", () => {
    expect(getDynamicQrFrameIndex(3, 0)).toBe(0);
    expect(getDynamicQrFrameIndex(3, 4)).toBe(1);
    expect(getDynamicQrFrameIndex(3, -1)).toBe(2);
    expect(getDynamicQrFrameIndex(0, 9)).toBe(0);
    expect(getDynamicQrFrameIndex(-2, 9)).toBe(0);
  });

  it("creates an auto-starting frame loop and cycles through frames", () => {
    vi.useFakeTimers();
    const onFrame = vi.fn();

    const controller = createDynamicQrFrameLoop(["frame-a", "frame-b", "frame-c"], onFrame, {
      intervalMs: 100,
    });

    expect(controller.intervalMs).toBe(100);
    expect(controller.frames).toEqual(["frame-a", "frame-b", "frame-c"]);
    expect(controller.isRunning).toBe(true);
    expect(controller.currentIndex).toBe(0);
    expect(onFrame).toHaveBeenNthCalledWith(1, "frame-a", 0);

    vi.advanceTimersByTime(100);
    expect(onFrame).toHaveBeenNthCalledWith(2, "frame-b", 1);
    expect(controller.currentIndex).toBe(1);

    vi.advanceTimersByTime(200);
    expect(onFrame).toHaveBeenNthCalledWith(3, "frame-c", 2);
    expect(onFrame).toHaveBeenNthCalledWith(4, "frame-a", 0);
    expect(controller.currentIndex).toBe(0);

    controller.stop();
    expect(controller.isRunning).toBe(false);
  });

  it("supports manual start, stop, and reset", () => {
    vi.useFakeTimers();
    const onFrame = vi.fn();

    const controller = createDynamicQrFrameLoop(["frame-a", "frame-b"], onFrame, {
      autoStart: false,
      intervalMs: DEFAULT_DYNAMIC_QR_INTERVAL_MS,
    });

    expect(controller.isRunning).toBe(false);
    expect(onFrame).not.toHaveBeenCalled();

    controller.start();
    controller.start();

    expect(onFrame).toHaveBeenCalledTimes(1);
    expect(onFrame).toHaveBeenLastCalledWith("frame-a", 0);
    expect(controller.isRunning).toBe(true);

    vi.advanceTimersByTime(DEFAULT_DYNAMIC_QR_INTERVAL_MS);
    expect(onFrame).toHaveBeenCalledTimes(2);
    expect(onFrame).toHaveBeenLastCalledWith("frame-b", 1);

    controller.stop();
    vi.advanceTimersByTime(DEFAULT_DYNAMIC_QR_INTERVAL_MS * 2);
    expect(onFrame).toHaveBeenCalledTimes(2);

    controller.reset();
    expect(controller.currentIndex).toBe(0);
    expect(controller.isRunning).toBe(false);

    controller.start();
    expect(onFrame).toHaveBeenCalledTimes(3);
    expect(onFrame).toHaveBeenLastCalledWith("frame-a", 0);
  });

  it("throws for invalid loop input", () => {
    expect(() => createDynamicQrFrameLoop([], vi.fn())).toThrow("frames must not be empty");
    expect(() => createDynamicQrFrameLoop(["frame"], vi.fn(), { intervalMs: 0 })).toThrow("intervalMs must be a positive integer");
    expect(() => createDynamicQrFrameLoop(["frame"], vi.fn(), { intervalMs: 1.5 })).toThrow("intervalMs must be a positive integer");
  });
});

describe("dynamic-qr with custom config", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("supports custom prefix in chunk frame", () => {
    const customPrefix = "CUSTOM";
    const chunk = new DynamicQrChunk(2, 0, "data", customPrefix);
    const frame = chunk.toFrame();

    expect(frame).toBe("CUSTOM:2:0:data");
    expect(isDynamicQrChunk(frame, { prefix: customPrefix })).toBe(true);
    expect(isDynamicQrChunk(frame)).toBe(false);
  });

  it("parses custom prefix frames", () => {
    const customPrefix = "XQR";
    const frame = `${customPrefix}:1:0:payload`;

    const chunk = parseDynamicQrChunk(frame, { prefix: customPrefix });
    expect(chunk).not.toBeNull();
    expect(chunk?.prefix).toBe(customPrefix);
  });

  it("splits frames with custom prefix", () => {
    const customPrefix = "MYQR";
    const frames = splitIntoDynamicQrFrames("ABC", { chunkSize: 2, prefix: customPrefix });

    expect(frames).toEqual([`${customPrefix}:2:0:AB`, `${customPrefix}:2:1:C`]);
    frames.forEach((frame) => expect(isDynamicQrChunk(frame, { prefix: customPrefix })).toBe(true));
  });

  it("maintains backward compatibility with default prefix", () => {
    const chunk = new DynamicQrChunk(1, 0, "data");
    const frame = chunk.toFrame();

    expect(frame.startsWith("BCQR:")).toBe(true);
    expect(isDynamicQrChunk(frame)).toBe(true);
  });
});
