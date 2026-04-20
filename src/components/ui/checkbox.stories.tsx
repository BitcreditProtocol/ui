import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    checked: false,
    disabled: false,
    size: "md",
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md"],
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: (args) => (
    <div className="w-fit flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Checkbox {...args} id="unchecked" />
        <Label htmlFor="unchecked">Unchecked</Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox {...args} id="checked" checked />
        <Label htmlFor="checked">Checked</Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox {...args} id="indeterminate" indeterminate />
        <Label htmlFor="indeterminate">Indeterminate</Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox {...args} id="disabled" disabled checked />
        <Label htmlFor="disabled">Disabled</Label>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(false);

    return (
      <div className="w-fit flex items-center gap-3">
        <Checkbox
          {...args}
          checked={checked}
          onCheckedChange={(nextChecked) => {
            setChecked(nextChecked === true);
          }}
        />
        <Label>Toggle me</Label>
      </div>
    );
  },
};
