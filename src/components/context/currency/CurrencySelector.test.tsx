import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CurrencySelector } from "./CurrencySelector";

function openSelector() {
  render(
    <CurrencySelector value="eur" onChange={vi.fn()}>
      <span>Display currencies</span>
    </CurrencySelector>
  );

  fireEvent.click(screen.getByText("Display currencies"));
}

describe("CurrencySelector", () => {
  afterEach(() => {
    cleanup();
  });

  it("replaces the list with an empty state when the search matches nothing", () => {
    openSelector();

    expect(screen.getByRole("radio", { name: /Euro/ })).toBeTruthy();

    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "no-such-currency" } });

    expect(screen.getByText("No currencies match your search.")).toBeTruthy();
    expect(screen.queryByRole("radiogroup")).toBeNull();
  });

  it("restores the full list from the empty state's clear action", () => {
    openSelector();

    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "no-such-currency" } });
    fireEvent.click(screen.getByText("Clear search"));

    expect(screen.queryByText("No currencies match your search.")).toBeNull();
    expect(screen.getByRole("radio", { name: /Euro/ })).toBeTruthy();
  });
});
