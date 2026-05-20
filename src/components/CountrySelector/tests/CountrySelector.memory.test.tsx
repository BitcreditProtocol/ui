import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CountrySelector } from "../CountrySelector";

type ViewportListener = () => void;

describe("CountrySelector cleanup", () => {
  const addViewportListener = vi.fn();
  const removeViewportListener = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });

    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: {
        height: 800,
        offsetTop: 0,
        addEventListener: addViewportListener,
        removeEventListener: removeViewportListener,
      },
    });

    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("removes viewport listeners when the open selector unmounts", async () => {
    const { unmount } = render(
      <IntlProvider locale="en" messages={{}}>
        <CountrySelector label="Country" callback={vi.fn()} value="DZ" />
      </IntlProvider>
    );

    const trigger = screen.getByRole("combobox");
    Object.defineProperty(trigger, "offsetWidth", {
      configurable: true,
      value: 320,
    });
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 200,
      top: 200,
      bottom: 258,
      left: 0,
      right: 320,
      width: 320,
      height: 58,
      toJSON: () => ({}),
    });

    fireEvent.click(trigger);

    await waitFor(() => {
      expect(addViewportListener).toHaveBeenCalledWith("resize", expect.any(Function));
      expect(addViewportListener).toHaveBeenCalledWith("scroll", expect.any(Function));
    });

    const resizeListener = addViewportListener.mock.calls.find(([type]) => type === "resize")?.[1] as ViewportListener;
    const scrollListener = addViewportListener.mock.calls.find(([type]) => type === "scroll")?.[1] as ViewportListener;

    unmount();

    expect(removeViewportListener).toHaveBeenCalledWith("resize", resizeListener);
    expect(removeViewportListener).toHaveBeenCalledWith("scroll", scrollListener);
  });
});
