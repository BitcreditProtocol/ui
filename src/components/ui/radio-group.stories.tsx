import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("monthly");

    return (
      <RadioGroup value={value} onValueChange={setValue}>
        {[
          ["monthly", "Monthly billing"],
          ["yearly", "Yearly billing"],
          ["custom", "Custom contract"],
        ].map(([optionValue, label]) => (
          <div key={optionValue} className="flex items-center gap-3">
            <RadioGroupItem value={optionValue} id={optionValue} />
            <Label htmlFor={optionValue}>{label}</Label>
          </div>
        ))}
      </RadioGroup>
    );
  },
};
