import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";

import { CopyToClipboardButton } from "./CopyToClipboardButton";

const messages = {
  "action.copyToClipboard.ariaLabel": "Copy to clipboard",
  "action.copyToClipboard.title": "Success!",
  "action.copyToClipboard.description": "Copied to clipboard!",
};

const meta = {
  title: "Components/CopyToClipboardButton",
  component: CopyToClipboardButton,
  decorators: [
    (Story) => (
      <IntlProvider locale="en-US" messages={messages}>
        <Story />
      </IntlProvider>
    ),
  ],
  args: {
    value: "bitcr1qxy2kgdygjrsqtzq2n9yrf243p83kkfjhxwlhc5m7v8n6d",
  },
} satisfies Meta<typeof CopyToClipboardButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InRow: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-300">Wallet address</span>
      <CopyToClipboardButton {...args} />
    </div>
  ),
};
