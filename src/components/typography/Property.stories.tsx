import type { Meta, StoryObj } from "@storybook/react-vite";

import { Property } from "./Property";

const meta = {
  title: "Typography/Property",
  component: Property,
} satisfies Meta<typeof Property>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Label",
    value: "Value",
  },
  render: () => (
    <div className="grid w-[420px] gap-4">
      <Property label="Company" value="Acme Inc." />
      <Property label="Invoice ID" value="INV-2026-000184" />
      <Property label="Optional note" value="" />
      <Property
        label="Truncated"
        value="A very long line that should be trimmed down for compact property display in constrained layouts."
        maxLength={36}
      />
    </div>
  ),
};
