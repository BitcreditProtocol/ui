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

export const CustomContent: Story = {
  args: {
    mode: "drawer",
    labels: {
      trigger: "House Rules",
      drawerTitle: "House Rules",
      drawerDescription: "Custom legal and compliance text supplied by the consuming app",
      pageTitle: "House Rules",
    },
    content: (
      <div className="text-text-200 text-xs leading-normal whitespace-pre-wrap break-words">
        <p className="font-medium mb-2">Marketplace Agreement</p>
        <p className="mt-4 mb-2">Summary:</p>
        <p>This content is supplied by the consuming app instead of the UI library defaults.</p>
        <p className="mt-4 mb-2">Terms:</p>
        <p>The app can provide its own wording, legal copy, and structure here.</p>
      </div>
    ),
  },
};

export const PageModeWithoutHeading: Story = {
  args: {
    mode: "page",
    hidePageHeading: true,
  },
};
