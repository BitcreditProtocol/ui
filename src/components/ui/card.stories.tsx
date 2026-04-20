import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

const meta = {
  title: "Components/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Team plan</CardTitle>
        <CardDescription>Manage seats, billing cadence, and workspace access.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-text-200">12 active seats, next invoice on May 1.</CardContent>
      <CardFooter className="justify-end">
        <Button size="sm">Manage</Button>
      </CardFooter>
    </Card>
  ),
};

export const Metrics: Story = {
  render: () => (
    <div className="grid w-[640px] grid-cols-3 gap-4">
      {[
        ["Revenue", "EUR 48,200"],
        ["Invoices", "1,284"],
        ["Overdue", "12"],
      ].map(([label, value]) => (
        <Card key={label}>
          <CardHeader className="pb-3">
            <CardDescription>{label}</CardDescription>
            <CardTitle className="text-xl">{value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
};
