import type { Meta, StoryObj } from "@storybook/react-vite";

import { Description, Title } from "./Step";

const meta = {
  title: "Typography/Step",
  component: Title,
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Title>Verify identity</Title>
      <Description>Upload an identification document and confirm your billing address.</Description>
    </div>
  ),
};
