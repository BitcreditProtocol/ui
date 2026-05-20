import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IntlProvider } from "react-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CountrySelector } from "../CountrySelector";

type ViewportListener = () => void;

describe("CountrySelector", () => {
  let viewportHeight = 800;
  let resizeListeners: Set<ViewportListener>;
  let scrollListeners: Set<ViewportListener>;

  const renderComponent = (props?: Partial<React.ComponentProps<typeof CountrySelector>>) => {
    const callback = vi.fn();
    const onChange = vi.fn();

    render(
      <IntlProvider locale="en" messages={{}}>
        <CountrySelector label="Country" callback={callback} onChange={onChange} name="country" {...props} />
      </IntlProvider>
    );

    return { callback, onChange };
  };

  const mockTriggerRect = ({ top, bottom, width = 320 }: { top: number; bottom: number; width?: number }) => {
    const trigger = screen.getByRole("combobox");

    Object.defineProperty(trigger, "offsetWidth", {
      configurable: true,
      value: width,
    });

    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: top,
      top,
      bottom,
      left: 0,
      right: width,
      width,
      height: bottom - top,
      toJSON: () => ({}),
    });

    return trigger;
  };

  beforeEach(() => {
    viewportHeight = 800;
    resizeListeners = new Set();
    scrollListeners = new Set();

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });

    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: {
        get height() {
          return viewportHeight;
        },
        addEventListener: (type: string, cb: ViewportListener) => {
          if (type === "resize") {
            resizeListeners.add(cb);
          }
          if (type === "scroll") {
            scrollListeners.add(cb);
          }
        },
        removeEventListener: (type: string, cb: ViewportListener) => {
          if (type === "resize") {
            resizeListeners.delete(cb);
          }
          if (type === "scroll") {
            scrollListeners.delete(cb);
          }
        },
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

  it("opens below when there is enough space", async () => {
    renderComponent({ value: "DZ" });
    const trigger = mockTriggerRect({ top: 200, bottom: 258 });

    fireEvent.click(trigger);

    await waitFor(() => {
      const content = document.body.querySelector("[data-side='bottom']") as HTMLElement | null;
      expect(content).toBeInTheDocument();
      expect(content?.style.maxHeight).toBe("400px");
    });
  });

  it("opens above when the visible space below is tight", async () => {
    viewportHeight = 420;
    renderComponent({ value: "DZ" });
    const trigger = mockTriggerRect({ top: 330, bottom: 388 });

    fireEvent.click(trigger);

    await waitFor(() => {
      const content = document.body.querySelector("[data-side='top']") as HTMLElement | null;
      expect(content).toBeInTheDocument();
    });
  });

  it("always opens below in iOS standalone mode", async () => {
    viewportHeight = 420;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)");

    renderComponent({ value: "DZ" });
    const trigger = mockTriggerRect({ top: 330, bottom: 388 });

    fireEvent.click(trigger);

    await waitFor(() => {
      const content = screen.getByRole("dialog");
      expect(content).toBeInTheDocument();
      expect(content.className).toContain("top-[calc(100%+6px)]");
      expect(content).toHaveStyle({ maxHeight: "120px" });
    });
  });

  it("does not change dropdown side while the page scrolls", async () => {
    viewportHeight = 420;
    renderComponent({ value: "DZ" });
    const trigger = mockTriggerRect({ top: 330, bottom: 388 });

    fireEvent.click(trigger);

    await waitFor(() => {
      const content = document.body.querySelector("[data-side='top']") as HTMLElement | null;
      expect(content).toBeInTheDocument();
    });

    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 120,
      top: 120,
      bottom: 178,
      left: 0,
      right: 320,
      width: 320,
      height: 58,
      toJSON: () => ({}),
    });

    fireEvent.scroll(window);

    await waitFor(() => {
      const content = document.body.querySelector("[data-side='top']") as HTMLElement | null;
      expect(content).toBeInTheDocument();
    });
  });

  it("renders inline instead of in a portal in iOS standalone mode", async () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)");

    renderComponent({ value: "DZ" });
    const trigger = mockTriggerRect({ top: 200, bottom: 258 });

    fireEvent.click(trigger);

    await waitFor(() => {
      const content = screen.getByRole("dialog");
      const wrapper = document.body.querySelector("[data-radix-popper-content-wrapper]");
      expect(content).toBeInTheDocument();
      expect(wrapper?.parentElement).not.toBe(document.body);
    });

    scrollListeners.forEach((listener) => {
      listener();
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("focuses the search input when opened in iOS standalone mode", async () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)");

    renderComponent();
    const trigger = mockTriggerRect({ top: 200, bottom: 258 });

    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search for a country...")).toHaveFocus();
    });
  });

  it("scrolls the trigger to the center when opened in iOS standalone mode", async () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)");

    renderComponent();
    const trigger = mockTriggerRect({ top: 200, bottom: 258 });
    Object.defineProperty(trigger, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
    });
    const scrollIntoViewSpy = vi.mocked(trigger.scrollIntoView);

    fireEvent.click(trigger);

    await waitFor(() => {
      expect(scrollIntoViewSpy).toHaveBeenCalledWith({
        block: "center",
        inline: "nearest",
      });
    });
  });

  it("scrolls the page scroll container when present in iOS standalone mode", async () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)");

    const { container } = render(
      <div className="page-scroll-container">
        <IntlProvider locale="en" messages={{}}>
          <CountrySelector label="Country" callback={vi.fn()} name="country" />
        </IntlProvider>
      </div>
    );

    const scrollContainer = container.querySelector(".page-scroll-container") as HTMLDivElement;
    const trigger = screen.getByRole("combobox");
    Object.defineProperty(trigger, "offsetWidth", {
      configurable: true,
      value: 320,
    });
    Object.defineProperty(scrollContainer, "clientHeight", {
      configurable: true,
      value: 600,
    });
    Object.defineProperty(scrollContainer, "scrollTop", {
      configurable: true,
      value: 100,
    });
    vi.spyOn(scrollContainer, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      bottom: 600,
      left: 0,
      right: 320,
      width: 320,
      height: 600,
      toJSON: () => ({}),
    });
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 500,
      top: 500,
      bottom: 558,
      left: 0,
      right: 320,
      width: 320,
      height: 58,
      toJSON: () => ({}),
    });
    Object.defineProperty(scrollContainer, "scrollTo", {
      configurable: true,
      value: vi.fn(),
    });
    const scrollToSpy = vi.mocked(scrollContainer.scrollTo);

    fireEvent.click(trigger);

    await waitFor(() => {
      expect(scrollToSpy).toHaveBeenCalled();
    });
  });

  it("filters, selects and clears the selected country", async () => {
    const user = userEvent.setup();
    const { callback, onChange } = renderComponent({ value: "DZ" });
    const trigger = mockTriggerRect({ top: 200, bottom: 258 });

    await user.click(trigger);
    await user.type(screen.getByPlaceholderText("Search for a country..."), "alb");
    await user.click(screen.getByText("Albania"));

    expect(callback).toHaveBeenCalledWith("AL");
    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "country",
        value: "AL",
      },
    });

    await user.click(trigger);
    const clearIcon = trigger.querySelectorAll("svg")[1];
    fireEvent.click(clearIcon as SVGElement);

    expect(callback).toHaveBeenCalledWith(undefined);
    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "country",
        value: "",
      },
    });
  });

  it("clears the search query with the inline clear button", async () => {
    const user = userEvent.setup();
    renderComponent();
    const trigger = mockTriggerRect({ top: 200, bottom: 258 });

    await user.click(trigger);
    await user.type(screen.getByPlaceholderText("Search for a country..."), "alb");

    const clearSearchButton = screen.getAllByRole("button").find((button) => button.className.includes("absolute right-4"));

    if (!clearSearchButton) {
      throw new Error("Search clear button not found");
    }

    await user.click(clearSearchButton);

    expect(screen.getByPlaceholderText("Search for a country...")).toHaveValue("");
    expect(screen.getByText("Afghanistan")).toBeInTheDocument();
  });

  it("shows an empty state when no country matches", async () => {
    const user = userEvent.setup();
    renderComponent();
    const trigger = mockTriggerRect({ top: 200, bottom: 258 });

    await user.click(trigger);
    await user.type(screen.getByPlaceholderText("Search for a country..."), "zzzz");

    expect(screen.getByText("No country found.")).toBeInTheDocument();
  });

  it("shows the selected country label when a value is provided", () => {
    renderComponent({ value: "DZ", isRequired: true });
    mockTriggerRect({ top: 200, bottom: 258 });

    expect(screen.getByText("Algeria")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders default country labels without an IntlProvider", () => {
    render(<CountrySelector label="Country" callback={vi.fn()} value="DZ" />);
    mockTriggerRect({ top: 200, bottom: 258 });

    expect(screen.getByText("Algeria")).toBeInTheDocument();
  });
});
