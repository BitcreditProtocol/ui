import { cleanup, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { afterEach, describe, expect, it } from "vitest";

import { Upload } from "./upload";

describe("Upload", () => {
  afterEach(() => {
    cleanup();
  });

  const renderComponent = () =>
    render(
      <IntlProvider locale="en" messages={{}}>
        <Upload />
      </IntlProvider>
    );

  it("should render upload label", () => {
    renderComponent();
    expect(screen.getByText("Upload document")).toBeInTheDocument();
  });

  it("should display file type and size restrictions", () => {
    renderComponent();
    const [el] = screen.getAllByText("PDF, PNG or JPG (max. 10 MB)");
    expect(el).toBeInTheDocument();
  });

  it("should have dashed border and cursor-pointer classes", () => {
    const { container } = renderComponent();
    const uploadDiv = container.firstChild as HTMLElement;
    expect(uploadDiv).toHaveClass("cursor-pointer");
    expect(uploadDiv).toHaveClass("border-dashed");
  });

  it("should render icon wrapper with brand background", () => {
    const { container } = renderComponent();
    const iconContainer = container.querySelector(".bg-brand-50");
    expect(iconContainer).toBeInTheDocument();
  });

  it("should render the upload svg icon", () => {
    const { container } = renderComponent();
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
