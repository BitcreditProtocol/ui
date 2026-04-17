import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";

import { NodeIdDisplay } from "./NodeIdDisplay";

const messages = {
  "action.copyToClipboard.ariaLabel": "Copy to clipboard",
  "action.copyToClipboard.title": "Success!",
  "action.copyToClipboard.description": "Copied to clipboard!",
};

const meta = {
  title: "Components/NodeIdDisplay",
  component: NodeIdDisplay,
  decorators: [
    (Story) => (
      <IntlProvider locale="en-US" messages={messages}>
        <Story />
      </IntlProvider>
    ),
  ],
  args: {
    nodeId: "bitcr1qxy2kgdygjrsqtzq2n9yrf243p83kkfjhxwlhc5m7v8n6ds4e",
  },
} satisfies Meta<typeof NodeIdDisplay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NarrowLayout: Story = {
  render: (args) => (
    <div className="w-[180px]">
      <NodeIdDisplay {...args} />
    </div>
  ),
};
