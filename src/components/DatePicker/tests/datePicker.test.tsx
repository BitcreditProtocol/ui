import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LanguageContext } from "@/components/context/language/LanguageContext.ts";
import type { DateRange } from "@/utils/dates.ts";

import { DatePicker } from "../datePicker.tsx";

const locale = "en-US";

function renderDatePicker(props: Partial<React.ComponentProps<typeof DatePicker>> = {}) {
  const onChange = vi.fn();
  const utils = render(
    <LanguageContext.Provider value={{ locale, setLocale: () => {}, availableLocales: () => [locale] }}>
      <DatePicker mode="range" onChange={onChange} {...props} />
    </LanguageContext.Provider>
  );

  const openSheet = () => {
    const trigger = utils.container.querySelector("button.peer") as HTMLButtonElement;
    fireEvent.click(trigger);
  };

  return { ...utils, onChange, openSheet };
}

describe("DatePicker", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("shows the 'Custom range' title with a back button in range mode", () => {
    const { openSheet } = renderDatePicker({ mode: "range" });
    openSheet();
    expect(screen.getByText("Custom range")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("shows no title and a close (X) button in single mode", () => {
    const { openSheet } = renderDatePicker({ mode: "single" });
    openSheet();
    expect(screen.queryByText("Custom range")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("hides the range preset chips by default", () => {
    const { openSheet } = renderDatePicker({ mode: "range" });
    openSheet();
    expect(screen.queryByRole("button", { name: "+30" })).not.toBeInTheDocument();
  });

  it("shows the range preset chips when shouldDisplayIncrementButtons is set, and applies a preset on click", () => {
    const { openSheet, onChange } = renderDatePicker({ mode: "range", shouldDisplayIncrementButtons: true });
    openSheet();

    const dayButtons = screen.getAllByRole("button", { name: "16" });
    const currentMonthDay = dayButtons.find((el) => !el.className.includes("text-text-200/70"));
    fireEvent.click(currentMonthDay!);

    fireEvent.click(screen.getByRole("button", { name: "+30" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(onChange).toHaveBeenCalledOnce();
    const range = onChange.mock.calls[0][0] as DateRange;
    const diffDays = Math.round((range.to!.getTime() - range.from!.getTime()) / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(30);
  });

  it("disables Confirm until a start date is selected in range mode", () => {
    const { openSheet } = renderDatePicker({ mode: "range" });
    openSheet();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeDisabled();
  });

  it("enables Confirm once only a start date is selected, and defaults the end date to the start date on confirm", () => {
    const { openSheet, onChange } = renderDatePicker({ mode: "range" });
    openSheet();

    const dayButtons = screen.getAllByRole("button", { name: "16" });
    const currentMonthDay = dayButtons.find((el) => !el.className.includes("text-text-200/70"));
    fireEvent.click(currentMonthDay!);

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    expect(confirmButton).toBeEnabled();

    fireEvent.click(confirmButton);

    expect(onChange).toHaveBeenCalledOnce();
    const range = onChange.mock.calls[0][0] as DateRange;
    expect(range.to?.getTime()).toBe(range.from?.getTime());
  });

  it("closes without calling onChange when the back button is clicked", () => {
    const { openSheet, onChange } = renderDatePicker({ mode: "range" });
    openSheet();

    const dayButtons = screen.getAllByRole("button", { name: "16" });
    const currentMonthDay = dayButtons.find((el) => !el.className.includes("text-text-200/70"));
    fireEvent.click(currentMonthDay!);
    fireEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(onChange).not.toHaveBeenCalled();
  });
});
