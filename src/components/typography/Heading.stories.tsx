import type { Meta, StoryObj } from "@storybook/react-vite";

import { Heading } from "./Heading";

const meta = {
  title: "Typography/Heading",
  component: Heading,
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Heading variant="page">Page heading</Heading>
      <Heading variant="section">Section heading</Heading>
      <Heading variant="sub">Sub heading</Heading>
    </div>
  ),
};
