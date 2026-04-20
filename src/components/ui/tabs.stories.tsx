import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    defaultValue: "account",
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args} className="w-[420px]">
      <TabsList className="w-full">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="rounded-lg border border-divider-50 bg-elevation-100 p-4">
        Profile settings and contact details.
      </TabsContent>
      <TabsContent value="billing" className="rounded-lg border border-divider-50 bg-elevation-100 p-4">
        Invoices, payment methods, and plan data.
      </TabsContent>
      <TabsContent value="security" className="rounded-lg border border-divider-50 bg-elevation-100 p-4">
        Password, MFA, and session controls.
      </TabsContent>
    </Tabs>
  ),
};

export const Compact: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[320px]">
      <TabsList className="w-full">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-text-200">
        A tighter two-tab layout.
      </TabsContent>
      <TabsContent value="activity" className="text-sm text-text-200">
        Recent actions and events.
      </TabsContent>
    </Tabs>
  ),
};
