import type { Meta, StoryObj } from "@storybook/react-vite";

import { QRCodeShareButton } from "./QRCodeShareButton";

const meta = {
  title: "Components/QRCodeShareButton",
  component: QRCodeShareButton,
  args: {
    value: "bitcredit:token:demo-123",
    shareTitle: "Share token",
  },
} satisfies Meta<typeof QRCodeShareButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const IconOnly: Story = {};

export const WithLabel: Story = {
  args: {
    label: "Share QR",
    variant: "withLabel",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Share QR",
    variant: "withLabel",
  },
};
