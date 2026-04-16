import type { Meta, StoryObj } from "@storybook/react-vite";

import { TruncatedTextPopover } from "./TruncatedTextPopover";

const meta = {
  title: "Components/TruncatedTextPopover",
  component: TruncatedTextPopover,
  parameters: {
    layout: "centered",
  },
  args: {
    text: "This is a deliberately long sentence that should truncate and reveal the full value in a popover.",
    maxLength: 24,
  },
} satisfies Meta<typeof TruncatedTextPopover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[180px]">
      <TruncatedTextPopover {...args} />
    </div>
  ),
};

export const ButtonTrigger: Story = {
  args: {
    as: "button",
    text: "bitcr1qxy2kgdygjrsqtzq2n9yrf243p83kkfjhxwlhc5m7v8n6ds4e",
    maxLength: 18,
  },
  render: (args) => (
    <div className="w-[180px]">
      <TruncatedTextPopover {...args} />
    </div>
  ),
};
