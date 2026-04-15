import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Profile avatar" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Fallbacks: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarFallback className="bg-brand-50 text-brand-200">AB</AvatarFallback>
      </Avatar>
      <Avatar className="h-14 w-14">
        <AvatarFallback className="bg-elevation-200 text-text-300">UI</AvatarFallback>
      </Avatar>
    </div>
  ),
};
