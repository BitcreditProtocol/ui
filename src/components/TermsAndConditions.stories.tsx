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

const longTermsContent = (
  <div className="text-text-200 text-xs leading-normal whitespace-pre-wrap break-words">
    <p className="font-medium mb-2">Long Form Terms</p>
    <p className="mt-4 mb-2">Summary:</p>
    <p>
      This story intentionally contains long content to verify drawer behavior with overflow, including max-height handling and bottom gradient
      fade while additional content remains below the fold.
    </p>
    <p className="mt-4 mb-2">Terms:</p>
    {Array.from({ length: 20 }, (_, idx) => (
      <p key={`term-${idx + 1}`} className="mt-2">
        {idx + 1}. This is test paragraph {idx + 1} used to simulate extended legal copy for scrolling behavior inside the drawer content
        area.
      </p>
    ))}
  </div>
);

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

export const DrawerModeLongContent: Story = {
  args: {
    mode: "drawer",
    labels: {
      trigger: "Review Long Terms",
      drawerTitle: "Long Terms",
      drawerDescription: "Long terms content used to validate drawer overflow behavior",
      pageTitle: "Long Terms",
    },
    content: longTermsContent,
  },
};

export const PageModeWithoutHeading: Story = {
  args: {
    mode: "page",
    hidePageHeading: true,
  },
};
