import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";

import { PreferencesProvider } from "../preferences/PreferencesProvider";
import DisplayCurrency from "./DisplayCurrency";

const meta = {
  title: "Context/DisplayCurrency",
  component: DisplayCurrency,
  decorators: [
    (Story) => (
      <IntlProvider locale="en">
        <PreferencesProvider>
          <Story />
        </PreferencesProvider>
      </IntlProvider>
    ),
  ],
} satisfies Meta<typeof DisplayCurrency>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
