import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Helpful supporting copy.</TooltipContent>
    </Tooltip>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="w-fit flex items-center gap-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="outline">
            Top
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Top tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="outline">
            Right
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Right tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="outline">
            Bottom
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
      </Tooltip>
    </div>
  ),
};
