import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollArea, ScrollBar } from "./scroll-area";

const meta = {
  title: "Components/ScrollArea",
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-72 w-[320px] rounded-lg border border-divider-50 bg-elevation-50 p-4">
      <div className="space-y-3">
        {Array.from({ length: 18 }).map((_, index) => (
          <div key={index} className="rounded-md border border-divider-50 bg-elevation-100 p-3 text-sm">
            Item {index + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-[420px] whitespace-nowrap rounded-lg border border-divider-50 bg-elevation-50">
      <div className="flex w-max gap-3 p-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="w-40 rounded-md border border-divider-50 bg-elevation-100 p-4 text-sm">
            Card {index + 1}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
