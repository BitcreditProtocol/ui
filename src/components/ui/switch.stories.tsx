import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Label } from "./label";
import { Switch } from "./switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(true);

    return (
      <div className="flex items-center gap-3">
        <Switch id="notifications" checked={checked} onCheckedChange={setChecked} />
        <Label htmlFor="notifications">Enable notifications</Label>
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <div className="w-fit flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch id="off" />
        <Label htmlFor="off">Off</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="on" checked />
        <Label htmlFor="on">On</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="disabled" checked disabled />
        <Label htmlFor="disabled">Disabled</Label>
      </div>
    </div>
  ),
};
