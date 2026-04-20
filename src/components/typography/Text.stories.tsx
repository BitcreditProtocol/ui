import type { Meta, StoryObj } from "@storybook/react-vite";

import { Text } from "./Text";

const meta = {
  title: "Typography/Text",
  component: Text,
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Text variant="body">Body text</Text>
      <Text variant="bodyMuted">Muted body text</Text>
      <Text variant="label">Label text</Text>
      <Text variant="caption">Caption text</Text>
      <Text variant="micro">Micro text</Text>
      <Text variant="mono" monoSize="sm">
        1A2B3C
      </Text>
      <Text variant="titleLg">Large title</Text>
      <Text variant="titleMd">Medium title</Text>
      <Text variant="titleSm">Small title</Text>
    </div>
  ),
};
