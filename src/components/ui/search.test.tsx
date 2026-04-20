import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { Search } from "./search";

describe("Search", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("updates uncontrolled input and notifies onChange", () => {
    const onChange = vi.fn();
    render(<Search placeholder="Search..." onChange={onChange} enableDebounce={false} />);

    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "wildcat" } });

    expect((input as HTMLInputElement).value).toBe("wildcat");
    expect(onChange).toHaveBeenCalledWith("wildcat");
  });

  it("runs debounced search with latest value", () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<Search placeholder="Search..." onSearch={onSearch} debounceMs={200} />);

    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "mint" } });

    vi.advanceTimersByTime(199);
    expect(onSearch).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onSearch).toHaveBeenCalledWith("mint");
  });

  it("handles Enter and Escape keyboard actions", () => {
    const onChange = vi.fn();
    const onSearch = vi.fn();
    render(<Search placeholder="Search..." onChange={onChange} onSearch={onSearch} enableDebounce={false} />);

    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "abc" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSearch).toHaveBeenCalledWith("abc");

    fireEvent.keyDown(input, { key: "Escape" });
    expect(onChange).toHaveBeenCalledWith("");
    expect(onSearch).toHaveBeenCalledWith("");
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("clears value from clear button", () => {
    const onChange = vi.fn();
    const onSearch = vi.fn();
    render(<Search placeholder="Search..." value="value" onChange={onChange} onSearch={onSearch} enableDebounce={false} />);

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onChange).toHaveBeenCalledWith("");
    expect(onSearch).toHaveBeenCalledWith("");
  });
});
