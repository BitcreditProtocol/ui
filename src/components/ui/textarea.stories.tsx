import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "./textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: {
    placeholder: "Write something...",
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContent: Story = {
  args: {
    defaultValue: "This component is useful for longer freeform input and notes.",
  },
};

export const States: Story = {
  render: (args) => (
    <div className="flex w-[420px] flex-col gap-4">
      <Textarea {...args} />
      <Textarea {...args} defaultValue="Preset content" />
      <Textarea {...args} disabled defaultValue="Disabled content" />
    </div>
  ),
};
