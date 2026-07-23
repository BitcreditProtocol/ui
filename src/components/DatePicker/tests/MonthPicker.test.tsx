import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageContext } from "@/components/context/language/LanguageContext.ts";

import { MonthPicker } from "../monthPicker.tsx";

const testNow = new Date(2024, 0, 20);

function renderComponent(props?: Partial<React.ComponentProps<typeof MonthPicker>>) {
  const onChange = vi.fn();
  const onCaptionLabelClicked = vi.fn();

  render(
    <LanguageContext.Provider
      value={{
        locale: "en-US",
        setLocale: vi.fn(),
        availableLocales: () => ["en-US"],
      }}
    >
      <MonthPicker value={new Date(2024, 5, 1)} onChange={onChange} onCaptionLabelClicked={onCaptionLabelClicked} {...props} />
    </LanguageContext.Provider>
  );

  return { onChange, onCaptionLabelClicked };
}

describe("MonthPicker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(testNow);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("changes the selected month and exposes the caption action", () => {
    const { onChange, onCaptionLabelClicked } = renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /June 2024/i }));
    expect(onCaptionLabelClicked).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "January" }));
    expect(onChange).toHaveBeenCalledWith(new Date(2024, 0, 1));
  });

  it("navigates years and blocks future months when requested", () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(now);
    const nextMonthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(new Date(currentYear, Math.min(now.getMonth() + 1, 11), 1));

    const { onChange } = renderComponent({
      value: new Date(currentYear, now.getMonth(), 1),
      shouldDisableFutureNavigation: true,
    });

    const nextYear = screen.getByRole("button", { name: "Next year" });
    expect(nextYear).toBeDisabled();

    expect(screen.getByRole("button", { name: currentMonthName })).not.toBeDisabled();
    if (now.getMonth() < 11) {
      expect(screen.getByRole("button", { name: nextMonthName })).toBeDisabled();
    }

    fireEvent.click(screen.getByRole("button", { name: "Previous year" }));
    fireEvent.click(screen.getByRole("button", { name: "January" }));

    expect(onChange).toHaveBeenCalledWith(new Date(currentYear - 1, 0, 1));
  });
});
