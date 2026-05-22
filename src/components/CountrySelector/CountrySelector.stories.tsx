import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { CountrySelector } from "./CountrySelector";

const meta: Meta = {
  title: "Components/CountrySelector",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof CountrySelector>;

function StatefulCountrySelector(args: React.ComponentProps<typeof CountrySelector>) {
  const [value, setValue] = React.useState(args.value);

  return (
    <div className="max-w-[375px] p-6">
      <CountrySelector
        {...args}
        value={value}
        callback={(nextValue) => {
          setValue(nextValue);
          args.callback(nextValue);
        }}
      />
    </div>
  );
}

const defaultArgs = {
  label: "Select Country",
  callback: (value: string | undefined) => {
    console.log("Selected:", value);
  },
};

export const Basic: Story = {
  render: (args) => <StatefulCountrySelector {...args} />,
  args: {
    ...defaultArgs,
  },
};

export const WithValue: Story = {
  render: (args) => <StatefulCountrySelector {...args} />,
  args: {
    ...defaultArgs,
    value: "GB",
  },
};

export const Required: Story = {
  render: (args) => <StatefulCountrySelector {...args} />,
  args: {
    ...defaultArgs,
    isRequired: true,
  },
};
