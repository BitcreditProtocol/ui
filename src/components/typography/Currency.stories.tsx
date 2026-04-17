import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";

import { PreferencesProvider } from "@/components/context/preferences/PreferencesProvider";

import { Currency } from "./Currency";

const meta = {
  title: "Typography/Currency",
  component: Currency,
  decorators: [
    (Story) => (
      <IntlProvider locale="en-US">
        <PreferencesProvider>
          <Story />
        </PreferencesProvider>
      </IntlProvider>
    ),
  ],
} satisfies Meta<typeof Currency>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 0,
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Currency value={1234.56} currency="USD" />
      <Currency value={-1234.56} currency="EUR" />
      <Currency value={0.12345678} currency="BTC" currencyDisplay="code" />
      <Currency value={123456} currency="SAT" currencyDisplay="code" />
    </div>
  ),
};
