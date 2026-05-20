import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Input } from "./input";

describe("Input", () => {
  afterEach(() => {
    cleanup();
  });

  it("uses a boolean error for styling without rendering true as text", () => {
    const { container } = render(<Input label="Name" error />);

    expect(container.querySelector(".border-red-500")).toBeInTheDocument();
    expect(screen.queryByText("true")).not.toBeInTheDocument();
  });

  it("renders string errors as the error message", () => {
    render(<Input label="Name" error="Name is required" />);

    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });
});
