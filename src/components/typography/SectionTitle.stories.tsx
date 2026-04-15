import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionTitle } from "./SectionTitle";

const meta = {
  title: "Typography/SectionTitle",
  component: SectionTitle,
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Profile details",
  },
};
