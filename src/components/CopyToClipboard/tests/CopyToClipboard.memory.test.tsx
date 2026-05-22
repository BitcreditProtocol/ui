import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CopyToClipboardButton } from "@/components/CopyToClipboard/CopyToClipboardButton.tsx";

vi.mock("@/hooks/use-toast.ts", () => ({
  toast: vi.fn(),
}));

function mockClipboard(writeText = vi.fn().mockResolvedValue(undefined)) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

describe("CopyToClipboardButton cleanup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClipboard();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("clears the pending checkmark reset timeout on unmount", async () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    const { unmount } = render(<CopyToClipboardButton value="test-value" showCheckmark />);

    fireEvent.click(screen.getByRole("button", { name: "Copy to clipboard" }));
    await act(async () => {
      await Promise.resolve();
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
  });
});
