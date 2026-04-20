import type { Meta, StoryObj } from "@storybook/react-vite";
import { BanknoteIcon } from "lucide-react";
import * as React from "react";
import { IntlProvider } from "react-intl";

import { AppIcon } from "@/components/ui/app-icon";

import MenuOption from "../MenuOption";
import { CurrencySelector } from "./CurrencySelector";

const meta = {
  title: "Context/CurrencySelector",
  component: CurrencySelector,
  decorators: [
    (Story) => (
      <IntlProvider locale="en">
        <Story />
      </IntlProvider>
    ),
  ],
} satisfies Meta<typeof CurrencySelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "usd",
    onChange: () => {},
  },
  render: () => {
    const [value, setValue] = React.useState("usd");

    return (
      <CurrencySelector value={value} onChange={setValue}>
        <MenuOption
          icon={<AppIcon icon={BanknoteIcon} className="text-text-300" size="lg" />}
          label="Display currency"
          defaultValue={value.toUpperCase()}
        />
      </CurrencySelector>
    );
  },
};
