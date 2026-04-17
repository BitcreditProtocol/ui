import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "./separator";

const meta = {
  title: "Components/Separator",
  component: Separator,
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[420px] space-y-4 rounded-lg border border-divider-50 bg-elevation-100 p-4">
      <div className="text-sm font-medium">Section one</div>
      <Separator />
      <div className="text-sm text-text-200">Section two</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-16 items-center rounded-lg border border-divider-50 bg-elevation-100 px-4">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" className="mx-4" />
      <span className="text-sm text-text-200">Right</span>
    </div>
  ),
};
