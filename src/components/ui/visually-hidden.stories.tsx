import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoIcon } from "lucide-react";

import { AppIcon } from "./app-icon";
import { VisuallyHidden } from "./visually-hidden";

const meta = {
  title: "Components/VisuallyHidden",
  component: VisuallyHidden,
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <button type="button" className="inline-flex items-center rounded-md border border-divider-75 p-2">
      <AppIcon icon={InfoIcon} />
      <VisuallyHidden>More information</VisuallyHidden>
    </button>
  ),
};
