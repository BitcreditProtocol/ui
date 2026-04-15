import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";

import { Upload } from "./upload";

const meta = {
  title: "Components/Upload",
  component: Upload,
  decorators: [
    (Story) => (
      <IntlProvider locale="en">
        <div className="w-[420px]">
          <Story />
        </div>
      </IntlProvider>
    ),
  ],
} satisfies Meta<typeof Upload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
