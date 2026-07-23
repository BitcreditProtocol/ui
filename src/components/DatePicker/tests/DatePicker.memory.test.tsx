import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageContext } from "@/components/context/language/LanguageContext.ts";

import { DatePicker } from "../datePicker.tsx";

function renderDatePicker() {
  return render(
    <IntlProvider locale="en" messages={{}}>
      <LanguageContext.Provider
        value={{
          locale: "en-US",
          setLocale: vi.fn(),
          availableLocales: () => ["en-US"],
        }}
      >
        <DatePicker mode="single" onChange={vi.fn()} />
      </LanguageContext.Provider>
    </IntlProvider>
  );
}

describe("DatePicker cleanup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("clears the pending close-blocker timeout on unmount", () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    const { unmount } = renderDatePicker();

    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
