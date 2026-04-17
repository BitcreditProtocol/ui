import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarIcon, CheckIcon, TriangleAlertIcon } from "lucide-react";

import { AppIcon } from "./app-icon";

const meta = {
  title: "Components/AppIcon",
  component: AppIcon,
  args: {
    icon: CalendarIcon,
    size: "md",
    weight: "default",
    className: "text-text-300",
  },
  argTypes: {
    icon: {
      control: "select",
      options: ["calendar", "check", "alert"],
      mapping: {
        calendar: CalendarIcon,
        check: CheckIcon,
        alert: TriangleAlertIcon,
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    weight: {
      control: "select",
      options: ["thin", "default", "strong"],
    },
    label: {
      control: "text",
    },
  },
} satisfies Meta<typeof AppIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Accessible: Story = {
  args: {
    label: "Calendar",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <AppIcon {...args} size="sm" />
      <AppIcon {...args} size="md" />
      <AppIcon {...args} size="lg" />
      <AppIcon {...args} size={28} />
    </div>
  ),
};

export const Weights: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <AppIcon {...args} weight="thin" />
      <AppIcon {...args} weight="default" />
      <AppIcon {...args} weight="strong" />
    </div>
  ),
};

export const CommonIcons: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <AppIcon {...args} icon={CalendarIcon} />
      <AppIcon {...args} icon={CheckIcon} className="text-signal-success" />
      <AppIcon {...args} icon={TriangleAlertIcon} className="text-signal-alert" />
    </div>
  ),
};
