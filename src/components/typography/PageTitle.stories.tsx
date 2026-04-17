import type { Meta, StoryObj } from "@storybook/react-vite";

import { PageTitle } from "./PageTitle";

const meta = {
  title: "Typography/PageTitle",
  component: PageTitle,
} satisfies Meta<typeof PageTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Settings",
  },
};
