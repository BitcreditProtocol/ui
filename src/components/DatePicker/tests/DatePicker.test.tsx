import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageContext } from "@/components/context/language/LanguageContext.ts";

import { DatePicker } from "../datePicker.tsx";

function renderComponent(props?: Partial<React.ComponentProps<typeof DatePicker>>) {
  const onChange = vi.fn();

  render(
    <IntlProvider locale="en" messages={{}}>
      <LanguageContext.Provider
        value={{
          locale: "en-US",
          setLocale: vi.fn(),
          availableLocales: () => ["en-US"],
        }}
      >
        <DatePicker mode="single" onChange={onChange} {...props} />
      </LanguageContext.Provider>
    </IntlProvider>
  );

  return { onChange };
}

describe("DatePicker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 20));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("supports a custom trigger component", () => {
    renderComponent({
      customComponent: <div role="button">Open custom calendar</div>,
    });

    fireEvent.click(screen.getByRole("button", { name: "Open custom calendar" }));

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("renders the provided label as the trigger", () => {
    renderComponent({ label: "Pick a date" });

    expect(screen.getByRole("button", { name: /Pick a date/i })).toBeInTheDocument();
  });

  it("enables confirm once a start date is set, even without an end date", () => {
    renderComponent({
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
        <LanguageContext.Provider
          value={{
            locale: "en-US",
            setLocale: vi.fn(),
            availableLocales: () => ["en-US"],
          }}
        >
          <DatePicker mode="single" onChange={onChange} value={{ from: new Date(2024, 0, 1), to: undefined }} />
        </LanguageContext.Provider>
      </IntlProvider>
    );

    rerender(
      <IntlProvider locale="en" messages={{}}>
        <LanguageContext.Provider
          value={{
            locale: "en-US",
            setLocale: vi.fn(),
            availableLocales: () => ["en-US"],
          }}
        >
          <DatePicker mode="single" onChange={onChange} value={{ from: new Date(2024, 1, 2), to: undefined }} />
        </LanguageContext.Provider>
      </IntlProvider>
    );

    expect(screen.getByRole("button", { name: /02 Feb 2024/i })).toBeInTheDocument();
  });
});
