import type { Meta, StoryObj } from "@storybook/react-vite";

import { TruncatedLinkPopover } from "./TruncatedLinkPopover";

const meta = {
  title: "Components/TruncatedLinkPopover",
  component: TruncatedLinkPopover,
  parameters: {
    layout: "centered",
  },
  args: {
    href: "https://example.com/path/to/a/very/long/document/link/that-needs-truncation",
    maxLength: 22,
  },
} satisfies Meta<typeof TruncatedLinkPopover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[220px]">
      <TruncatedLinkPopover {...args} />
    </div>
  ),
};

export const CustomText: Story = {
  args: {
    text: "Open supporting bill document for transaction #42",
  },
  render: (args) => (
    <div className="w-[220px]">
      <TruncatedLinkPopover {...args} />
    </div>
  ),
};
