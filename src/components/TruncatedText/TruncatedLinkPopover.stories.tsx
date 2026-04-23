import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";

import { TruncatedLinkPopover } from "./TruncatedLinkPopover";

const messages = {
  "action.copyToClipboard.ariaLabel": "Copy to clipboard",
  "action.copyToClipboard.title": "Success!",
  "action.copyToClipboard.description": "Copied to clipboard!",
};

const meta = {
  title: "Components/TruncatedLinkPopover",
  component: TruncatedLinkPopover,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <IntlProvider locale="en-US" messages={messages}>
        <Story />
      </IntlProvider>
    ),
  ],
  args: {
    href: "https://example.com/path/to/a/very/long/document/link/that-needs-truncation",
    maxLength: 22,
    showCopyButton: true,
  },
} satisfies Meta<typeof TruncatedLinkPopover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[220px]">
      <TruncatedLinkPopover {...args} />
    </div>
  ),
};

export const CustomText: Story = {
  args: {
    text: "Open supporting bill document for transaction #42",
  },
  render: (args) => (
    <div className="w-[220px]">
      <TruncatedLinkPopover {...args} />
    </div>
  ),
};

export const WithCopyButton: Story = {
  args: {
    showCopyButton: true,
  },
  render: (args) => (
    <div className="w-[220px]">
      <TruncatedLinkPopover {...args} />
    </div>
  ),
};
