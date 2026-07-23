import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageContext } from "@/components/context/language/LanguageContext.ts";

import { YearPicker } from "../yearPicker.tsx";

const testNow = new Date(2024, 0, 20);

function renderComponent(props?: Partial<React.ComponentProps<typeof YearPicker>>) {
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
      <YearPicker
        value={new Date(2024, 0, 1)}
        onChange={onChange}
        onCaptionLabelClicked={onCaptionLabelClicked}
        numberYears={5}
        {...props}
      />
    </LanguageContext.Provider>
  );

  return { onChange, onCaptionLabelClicked };
}

describe("YearPicker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(testNow);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("changes the selected year and exposes the caption action", () => {
    const { onChange, onCaptionLabelClicked } = renderComponent();

    fireEvent.click(screen.getAllByRole("button", { name: "2024" })[0]);
    expect(onCaptionLabelClicked).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getAllByRole("button", { name: "2026" })[0]);
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 0, 1));
  });

  it("supports paging with buttons and touch gestures", () => {
    const { onChange } = renderComponent({
      value: new Date(2020, 0, 1),
      order: "desc",
    });

    fireEvent.click(screen.getByRole("button", { name: "Next years" }));
    fireEvent.click(screen.getByRole("button", { name: "2025" }));
    expect(onChange).toHaveBeenCalledWith(new Date(2025, 0, 1));

    const root = screen.getByRole("button", { name: "Previous years" }).closest("div[class*='flex flex-col']");
    if (!root) {
      throw new Error("Year picker root not found");
    }

    fireEvent.touchStart(root, { touches: [{ clientX: 200 }] });
    fireEvent.touchEnd(root, { changedTouches: [{ clientX: 120 }] });
    fireEvent.touchStart(root, { touches: [{ clientX: 120 }] });
    fireEvent.touchEnd(root, { changedTouches: [{ clientX: 220 }] });
  });

  it("blocks future navigation when configured", () => {
    const currentYear = new Date().getFullYear();

    renderComponent({
      value: new Date(currentYear, 0, 1),
      shouldDisableFutureNavigation: true,
      currentYearPosition: "end",
    });

    expect(screen.getByRole("button", { name: "Next years" })).toBeDisabled();
  });
});
