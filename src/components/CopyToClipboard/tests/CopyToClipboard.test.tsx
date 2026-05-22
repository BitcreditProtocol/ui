import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { MouseEvent } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CopyToClipboardButton } from "@/components/CopyToClipboard/CopyToClipboardButton.tsx";
import { toast } from "@/hooks/use-toast.ts";

vi.mock("@/hooks/use-toast.ts", () => ({
  toast: vi.fn(),
}));

function mockClipboard(writeText = vi.fn().mockResolvedValue(undefined)) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });

  return writeText;
}

describe("CopyToClipboardButton", () => {
  let writeText: ReturnType<typeof mockClipboard>;

  beforeEach(() => {
    vi.clearAllMocks();
    writeText = mockClipboard();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders an accessible button with safe button defaults", () => {
    render(<CopyToClipboardButton value="test-value" />);

    const button = screen.getByRole("button", { name: "Copy to clipboard" });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
  });

  it("copies the provided value and shows a success toast", async () => {
    const onCopy = vi.fn();
    render(<CopyToClipboardButton value="test-value" label="Node ID" onCopy={onCopy} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy to clipboard" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("test-value");
    });
    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(toast).toHaveBeenCalledWith({
      title: "Success!",
      description: "Node ID copied to clipboard!",
      position: "top-center",
      duration: 2500,
    });
  });

  it("forwards click events before copying", async () => {
    const onClick = vi.fn();
    render(<CopyToClipboardButton value="test-value" onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy to clipboard" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("test-value");
    });
  });

  it("does not copy when the click event is prevented", () => {
    const onClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    });
    render(<CopyToClipboardButton value="test-value" onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy to clipboard" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(writeText).not.toHaveBeenCalled();
    expect(toast).not.toHaveBeenCalled();
  });

  it("shows an error toast when the clipboard write fails", async () => {
    const onCopy = vi.fn();
    writeText = mockClipboard(vi.fn().mockRejectedValue(new Error("denied")));
    render(<CopyToClipboardButton value="test-value" label="Node ID" onCopy={onCopy} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy to clipboard" }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: "Copy failed",
        description: "Failed to copy Node ID.",
        variant: "error",
        position: "top-center",
        duration: 2500,
      });
    });
    expect(onCopy).not.toHaveBeenCalled();
  });

  it("supports direct message overrides", async () => {
    render(
      <CopyToClipboardButton
        value="test-value"
        label="Reference"
        messages={{
          "ui.copyToClipboard.ariaLabel": "Copy reference",
          "ui.copyToClipboard.successDescription": "Copied {label}",
          "ui.copyToClipboard.successTitle": "Copied",
        }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy reference" }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: "Copied",
        description: "Copied Reference",
        position: "top-center",
        duration: 2500,
      });
    });
  });
});
