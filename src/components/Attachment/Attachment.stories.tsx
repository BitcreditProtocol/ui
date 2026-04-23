import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Attachment } from "./Attachment";

const sampleData = new TextEncoder().encode("Sample attachment payload for Storybook.");

const meta = {
  title: "Components/Attachment",
  component: Attachment,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Attachment>;

export default meta;

type Story = StoryObj<typeof meta>;

const stubGetFile = async () => ({ data: sampleData, content_type: "application/pdf" });

export const WithoutId: Story = {
  args: {
    fileName: "Quarterly-report-for-board-review.pdf",
    getFile: stubGetFile,
  },
  render: () => (
    <div className="w-[360px]">
      <Attachment
        fileName="Quarterly-report-for-board-review.pdf"
        getFile={async () => ({ data: sampleData, content_type: "application/pdf" })}
      />
    </div>
  ),
};

export const WithId: Story = {
  args: {
    fileName: "invoice-42-supporting-document.png",
    getFile: stubGetFile,
  },
  render: () => (
    <div className="w-[360px]">
      <Attachment
        id="invoice-42"
        fileName="invoice-42-supporting-document.png"
        getFile={async (id, fileName) => ({
          data: sampleData,
          content_type: fileName.endsWith(".png") && id.startsWith("invoice") ? "image/png" : "application/octet-stream",
        })}
      />
    </div>
  ),
};

export const WithClassName: Story = {
  args: {
    fileName: "custom-styled-document.pdf",
    getFile: stubGetFile,
  },
  render: () => (
    <div className="w-[360px]">
      <Attachment
        fileName="custom-styled-document.pdf"
        className="border-2 border-dashed"
        getFile={async () => ({ data: sampleData, content_type: "application/pdf" })}
      />
    </div>
  ),
};

export const MultipleWithCoordination: Story = {
  args: {
    fileName: "Annual-report-2024.pdf",
    getFile: stubGetFile,
  },
  render: () => {
    const files = ["Annual-report-2024.pdf", "Invoice-details.xlsx", "Supporting-evidence.png"];
    const [openingIndex, setOpeningIndex] = useState<number | null>(null);

    return (
      <div className="w-[360px] flex flex-col gap-2">
        {files.map((fileName, index) => (
          <Attachment
            key={fileName}
            fileName={fileName}
            disabled={openingIndex !== null && openingIndex !== index}
            onOpeningChange={(opening) => setOpeningIndex(opening ? index : null)}
            getFile={async () => ({ data: sampleData, content_type: "application/pdf" })}
          />
        ))}
      </div>
    );
  },
};
