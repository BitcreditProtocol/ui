import type { Meta, StoryObj } from "@storybook/react-vite";

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

export const WithoutId: Story = {
  args: {
    fileName: "Quarterly-report-for-board-review.pdf",
    getFile: async () => ({
      data: sampleData,
      content_type: "application/pdf",
    }),
  },
  render: () => (
    <div className="w-[360px]">
      <Attachment
        fileName="Quarterly-report-for-board-review.pdf"
        getFile={async () => ({
          data: sampleData,
          content_type: "application/pdf",
        })}
      />
    </div>
  ),
};

export const WithId: Story = {
  args: {
    id: "invoice-42",
    fileName: "invoice-42-supporting-document.png",
    getFile: async (id, fileName) => ({
      data: sampleData,
      content_type: fileName.endsWith(".png") && id.startsWith("invoice") ? "image/png" : "application/octet-stream",
    }),
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
