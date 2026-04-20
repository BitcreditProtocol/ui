import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Search } from "./search";

const meta = {
  title: "Components/Search",
  component: Search,
  args: {
    placeholder: "Search documents",
    size: "md",
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = React.useState("Invoice");

    return <Search {...args} value={value} onChange={setValue} />;
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-[420px] flex-col gap-3">
      <Search {...args} size="xs" placeholder="Extra small" />
      <Search {...args} size="sm" placeholder="Small" />
      <Search {...args} size="md" placeholder="Medium" />
      <Search {...args} size="lg" placeholder="Large" />
    </div>
  ),
};
