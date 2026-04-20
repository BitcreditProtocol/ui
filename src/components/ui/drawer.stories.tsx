import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";

const meta = {
  title: "Components/Drawer",
  component: Drawer,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-[430px] mx-auto">
        <DrawerHeader>
          <DrawerTitle>Sort and filter</DrawerTitle>
          <DrawerDescription>Use a bottom sheet for mobile-first secondary controls.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-2 text-sm text-text-200">Body content</div>
        <DrawerFooter>
          <Button>Apply</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
