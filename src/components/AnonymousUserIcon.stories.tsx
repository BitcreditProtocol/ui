import type { Meta, StoryObj } from "@storybook/react-vite";

import { AnonymousUserIcon } from "./AnonymousUserIcon";

const meta = {
  title: "Components/AnonymousUserIcon",
  component: AnonymousUserIcon,
  args: {
    alt: "Anonymous user",
  },
} satisfies Meta<typeof AnonymousUserIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-fit rounded-full bg-text-300 p-3">
      <AnonymousUserIcon {...args} className="h-8 w-8" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="w-fit flex items-center gap-4 rounded-full bg-text-300 p-4">
      <AnonymousUserIcon {...args} className="h-5 w-5" />
      <AnonymousUserIcon {...args} className="h-8 w-8" />
      <AnonymousUserIcon {...args} className="h-12 w-12" />
    </div>
  ),
};
