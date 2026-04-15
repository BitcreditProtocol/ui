import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FULLSCREEN_DIALOG_CONTENT_CLASS,
} from "./dialog";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive item</DialogTitle>
          <DialogDescription>This action moves the item out of the active workspace. You can restore it later.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const FullscreenMobileSheet: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open fullscreen</Button>
      </DialogTrigger>
      <DialogContent className={FULLSCREEN_DIALOG_CONTENT_CLASS}>
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>Use the space like a mobile fullscreen sheet while keeping the same dialog primitives.</DialogDescription>
        </DialogHeader>
        <div className="flex-1 rounded-lg border border-divider-50 bg-elevation-100 p-4 text-sm text-text-200">Content area</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
