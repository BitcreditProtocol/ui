import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LanguageContext } from "@/components/context/language/LanguageContext";

import { Calendar } from "./calendar";

const locale = "en-US";

function renderCalendar(props: Partial<React.ComponentProps<typeof Calendar>> = {}) {
  const onSelect = vi.fn();
  const onCaptionLabelClicked = vi.fn();

  const utils = render(
    <LanguageContext.Provider value={{ locale, setLocale: () => {}, availableLocales: () => [locale] }}>
      <Calendar
        mode="single"
        selected={{ from: new Date(2026, 3, 1) }}
        onSelect={onSelect}
        onCaptionLabelClicked={onCaptionLabelClicked}
        {...props}
      />
    </LanguageContext.Provider>
  );

  return { ...utils, onSelect, onCaptionLabelClicked };
}

function swipe(element: HTMLElement, fromX: number, toX: number) {
  fireEvent.touchStart(element, { touches: [{ clientX: fromX, clientY: 0 }] });
  fireEvent.touchEnd(element, { changedTouches: [{ clientX: toX, clientY: 0 }] });
}

describe("Calendar", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders the visible month and year", () => {
    renderCalendar({ selected: { from: new Date(2026, 3, 1) } });
    expect(screen.getByText("April 2026")).toBeInTheDocument();
  });

  it("navigates to the previous month via arrow button", () => {
    renderCalendar({ selected: { from: new Date(2026, 3, 1) } });
    fireEvent.click(screen.getByRole("button", { name: "Previous month" }));
    expect(screen.getByText("March 2026")).toBeInTheDocument();
  });

  it("navigates to the next month via arrow button", () => {
    renderCalendar({ selected: { from: new Date(2026, 3, 1) } });
    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByText("May 2026")).toBeInTheDocument();
  });

  it("calls onCaptionLabelClicked when the month/year label is clicked", () => {
    const { onCaptionLabelClicked } = renderCalendar();
    fireEvent.click(screen.getByRole("button", { name: "Open month and year picker" }));
    expect(onCaptionLabelClicked).toHaveBeenCalledOnce();
  });

  it("calls onSelect with the clicked day", () => {
    const { onSelect } = renderCalendar({ selected: { from: new Date(2026, 3, 1) } });
    fireEvent.click(screen.getByRole("button", { name: "15" }));
    expect(onSelect).toHaveBeenCalledOnce();
    const [, selectedDay] = onSelect.mock.calls[0];
    expect(selectedDay).toEqual(new Date(2026, 3, 15));
  });

  describe("swipe navigation", () => {
    it("swipes left to go to the next month", () => {
      const { container } = renderCalendar({ selected: { from: new Date(2026, 3, 1) } });
      swipe(container.firstChild as HTMLElement, 200, 100);
      expect(screen.getByText("May 2026")).toBeInTheDocument();
    });

    it("swipes right to go to the previous month", () => {
      const { container } = renderCalendar({ selected: { from: new Date(2026, 3, 1) } });
      swipe(container.firstChild as HTMLElement, 100, 200);
      expect(screen.getByText("March 2026")).toBeInTheDocument();
    });

    it("does not navigate on a short swipe (< 50px)", () => {
      const { container } = renderCalendar({ selected: { from: new Date(2026, 3, 1) } });
      swipe(container.firstChild as HTMLElement, 100, 130);
      expect(screen.getByText("April 2026")).toBeInTheDocument();
    });

    it("does not navigate forward when isFutureNavigationDisabled and already at current month", () => {
      const now = new Date();
      const { container } = renderCalendar({
        selected: { from: new Date(now.getFullYear(), now.getMonth(), 1) },
        isFutureNavigationDisabled: true,
      });
      swipe(container.firstChild as HTMLElement, 200, 100);
      const expected = now.toLocaleString("en-US", { month: "long", year: "numeric" });
      expect(screen.getByText(expected)).toBeInTheDocument();
    });
  });
});
