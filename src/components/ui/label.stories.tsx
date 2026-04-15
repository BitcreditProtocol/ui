import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "Components/Label",
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};
