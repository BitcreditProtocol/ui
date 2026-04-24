import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";

import { TermsAndConditions } from "./TermsAndConditions";

const locale = "en-US";

const meta = {
  title: "Components/TermsAndConditions",
  component: TermsAndConditions,
  decorators: [
    (Story) => (
      <IntlProvider locale={locale}>
        <div className="min-h-[720px] bg-elevation-100 p-6">
          <Story />
        </div>
      </IntlProvider>
    ),
  ],
  argTypes: {
    mode: {
      options: ["drawer", "page"],
      control: { type: "radio" },
    },
    hidePageHeading: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof TermsAndConditions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DrawerMode: Story = {
  args: {
    mode: "drawer",
  },
};

export const PageMode: Story = {
  args: {
    mode: "page",
  },
};

export const PageModeWithoutHeading: Story = {
  args: {
    mode: "page",
    hidePageHeading: true,
  },
};
