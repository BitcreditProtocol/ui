import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const meta = {
  title: "Components/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Quick actions</h4>
          <p className="text-sm text-text-200">Keep secondary actions close to the trigger without leaving the current context.</p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Show arrow</Button>
      </PopoverTrigger>
      <PopoverContent showArrow className="w-80">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Team access</h4>
          <p className="text-sm text-text-200">Invite collaborators, assign roles, and review active members.</p>
          <div className="flex gap-2">
            <Button size="sm">Invite</Button>
            <Button size="sm" variant="outline">
              Manage
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
