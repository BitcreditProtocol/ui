import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageContext } from "@/components/context/language/LanguageContext.ts";
import type { DateRange } from "@/utils/dates.ts";

import { DatePicker } from "../datePicker.tsx";

const locale = "en-US";
const testNow = new Date(2024, 0, 20);

function renderDatePicker(props: Partial<React.ComponentProps<typeof DatePicker>> = {}) {
  const onChange = vi.fn();
  const utils = render(
    <IntlProvider locale="en" messages={{}}>
      <LanguageContext.Provider value={{ locale, setLocale: () => {}, availableLocales: () => [locale] }}>
        <DatePicker mode="range" onChange={onChange} {...props} />
      </LanguageContext.Provider>
    </IntlProvider>
  );

  const openSheet = () => {
    const trigger = utils.container.querySelector("button.peer") as HTMLButtonElement;
    fireEvent.click(trigger);
  };

  return { ...utils, onChange, openSheet };
}

describe("DatePicker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(testNow);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("shows the 'Custom range' title with a back button in range mode", () => {
    const { openSheet } = renderDatePicker({ mode: "range" });
    openSheet();
    expect(screen.getByText("Custom range")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("supports a custom trigger component", () => {
    renderDatePicker({
      customComponent: <div role="button">Open custom calendar</div>,
      mode: "single",
    });

    fireEvent.click(screen.getByRole("button", { name: "Open custom calendar" }));

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("renders the provided label as the trigger", () => {
    renderDatePicker({ label: "Pick a date", mode: "single" });

    expect(screen.getByRole("button", { name: /Pick a date/i })).toBeInTheDocument();
  });

  it("enables confirm once a start date is set, even without an end date", () => {
    renderDatePicker({
      mode: "range",
      value: { from: new Date(2024, 0, 10), to: undefined },
    });

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(screen.getByRole("button", { name: "Confirm" })).toBeEnabled();
  });

  it("syncs from incoming value changes while closed", () => {
    const onChange = vi.fn();

    const { rerender } = render(
      <IntlProvider locale="en" messages={{}}>
        <LanguageContext.Provider value={{ locale, setLocale: () => {}, availableLocales: () => [locale] }}>
          <DatePicker mode="single" onChange={onChange} value={{ from: new Date(2024, 0, 1), to: undefined }} />
        </LanguageContext.Provider>
      </IntlProvider>
    );

    rerender(
      <IntlProvider locale="en" messages={{}}>
        <LanguageContext.Provider value={{ locale, setLocale: () => {}, availableLocales: () => [locale] }}>
          <DatePicker mode="single" onChange={onChange} value={{ from: new Date(2024, 1, 2), to: undefined }} />
        </LanguageContext.Provider>
      </IntlProvider>
    );

    expect(screen.getByRole("button", { name: /02 Feb 2024/i })).toBeInTheDocument();
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
