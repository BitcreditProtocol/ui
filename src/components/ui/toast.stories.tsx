import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "./toast";

const meta = {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <ToastProvider>
      <div className="space-y-3 p-6">
        <Toast open variant="info">
          <div className="grid gap-1">
            <ToastTitle>Information</ToastTitle>
            <ToastDescription>This is the default informational toast.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
        <Toast open variant="success">
          <div className="grid gap-1">
            <ToastTitle>Success</ToastTitle>
            <ToastDescription>Your changes have been saved.</ToastDescription>
          </div>
          <ToastAction altText="Undo action">Undo</ToastAction>
          <ToastClose />
        </Toast>
        <Toast open variant="error">
          <div className="grid gap-1">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>We could not complete that request.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      </div>
      <ToastViewport position="top-right" />
    </ToastProvider>
  ),
};
