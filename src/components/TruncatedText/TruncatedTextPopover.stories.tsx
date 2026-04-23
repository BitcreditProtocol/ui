import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";

import { TruncatedTextPopover } from "./TruncatedTextPopover";

const messages = {
  "action.copyToClipboard.ariaLabel": "Copy to clipboard",
  "action.copyToClipboard.title": "Success!",
  "action.copyToClipboard.description": "Copied to clipboard!",
};

const meta = {
  title: "Components/TruncatedTextPopover",
  component: TruncatedTextPopover,
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
    text: "This is a deliberately long sentence that should truncate and reveal the full value in a popover.",
    maxLength: 24,
    showCopyButton: true,
  },
} satisfies Meta<typeof TruncatedTextPopover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[180px]">
      <TruncatedTextPopover {...args} />
    </div>
  ),
};

export const ButtonTrigger: Story = {
  args: {
    as: "button",
    text: "bitcr1qxy2kgdygjrsqtzq2n9yrf243p83kkfjhxwlhc5m7v8n6ds4e",
    maxLength: 18,
  },
  render: (args) => (
    <div className="w-[180px]">
      <TruncatedTextPopover {...args} />
    </div>
  ),
};

export const WithCopyButton: Story = {
  args: {
    showCopyButton: true,
    text: "bitcr1qxy2kgdygjrsqtzq2n9yrf243p83kkfjhxwlhc5m7v8n6ds4e",
    maxLength: 18,
  },
  render: (args) => (
    <div className="w-[180px]">
      <TruncatedTextPopover {...args} />
    </div>
  ),
};
