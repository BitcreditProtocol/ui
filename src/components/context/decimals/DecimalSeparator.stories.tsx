import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";

import { PreferencesProvider } from "../preferences/PreferencesProvider";
import { DecimalSeparatorSetting } from "./DecimalSeparator";

const meta = {
  title: "Context/DecimalSeparator",
  component: DecimalSeparatorSetting,
  decorators: [
    (Story) => (
      <IntlProvider locale="en">
        <PreferencesProvider>
          <Story />
        </PreferencesProvider>
      </IntlProvider>
    ),
  ],
} satisfies Meta<typeof DecimalSeparatorSetting>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
