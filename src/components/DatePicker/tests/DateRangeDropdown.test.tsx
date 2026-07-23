import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IntlProvider } from "react-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DateRangeDropdown } from "../dateRangeDropdown.tsx";

function renderComponent(props?: Partial<React.ComponentProps<typeof DateRangeDropdown>>) {
  const onRangeChange = vi.fn();
  const onClear = vi.fn();

  render(
    <IntlProvider locale="en" messages={{}}>
      <DateRangeDropdown onRangeChange={onRangeChange} onClear={onClear} {...props} />
    </IntlProvider>
  );

  return { onRangeChange, onClear };
}

describe("DateRangeDropdown", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("shows the selected preset label and changes the range from the menu", async () => {
    const user = userEvent.setup();
    const { onRangeChange } = renderComponent({ value: 180 });

    expect(screen.getByRole("button", { name: /6 Months/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /6 Months/i }));
    await user.click(await screen.findByRole("menuitemradio", { name: "90 Days" }));

    expect(onRangeChange).toHaveBeenCalledWith(90);
  });

  it("shows the default label for unknown values", () => {
    renderComponent({ value: 999 });

    expect(screen.getByRole("button", { name: /Select range/i })).toBeInTheDocument();
  });

  it("clears the selected range from pointer and keyboard interactions", async () => {
    const user = userEvent.setup();
    const { onClear } = renderComponent({ value: 30 });

    const clearButton = screen.getByRole("button", {
      name: "Clear preset range",
    });

    fireEvent.pointerDown(clearButton);
    await user.click(clearButton);
    fireEvent.keyDown(clearButton, { key: "Enter" });
    fireEvent.keyDown(clearButton, { key: " " });

    expect(onClear).toHaveBeenCalledTimes(3);
  });
});
