import type { Meta, StoryObj } from "@storybook/react-vite";

import { toast } from "@/hooks/use-toast";
import { Button } from "./button";
import { Toaster } from "./toaster";

const meta = {
  title: "Components/Toaster",
  component: Toaster,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="p-6">
      <div className="flex gap-2">
        <Button
          onClick={() =>
            toast({
              title: "The invoice was sent successfully.",
              variant: "success",
            })
          }
        >
          Success toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              title: "Some fields still need attention.",
              variant: "warning",
            })
          }
        >
          Warning toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              title: "Your session has been updated.",
              variant: "info",
            })
          }
        >
          Info toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              title: "We could not complete that request.",
              variant: "error",
            })
          }
        >
          Error toast
        </Button>
      </div>
      <Toaster />
    </div>
  ),
};
