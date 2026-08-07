import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";

import { PreferencesProvider } from "../preferences/PreferencesProvider";
import DateFormat from "./DateFormat";

const meta = {
  title: "Context/DateFormat",
  component: DateFormat,
  decorators: [
    (Story) => (
      <IntlProvider locale="en">
        <PreferencesProvider>
          <Story />
        </PreferencesProvider>
      </IntlProvider>
    ),
  ],
} satisfies Meta<typeof DateFormat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
