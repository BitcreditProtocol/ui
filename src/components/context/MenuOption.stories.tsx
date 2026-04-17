import type { Meta, StoryObj } from "@storybook/react-vite";
import { GlobeIcon } from "lucide-react";

import { AppIcon } from "@/components/ui/app-icon";

import MenuOption from "./MenuOption";

const meta = {
  title: "Context/MenuOption",
  component: MenuOption,
  args: {
    icon: <AppIcon icon={GlobeIcon} className="text-text-300" size="lg" />,
    label: "Language",
    defaultValue: "English",
    disabled: false,
  },
} satisfies Meta<typeof MenuOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
