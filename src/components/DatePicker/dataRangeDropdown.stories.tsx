import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { IntlProvider } from "react-intl";

import { DateRangeDropdown } from "./dataRangeDropdown";

const messages = {
  "displayRange.days": "{value} Days",
  "displayRange.sixMonths": "6 Months",
  "displayRange.oneYear": "1 Year",
  "displayRange.selectRange": "Select range",
  "dropdown.option.30days": "30 Days",
  "dropdown.option.60days": "60 Days",
  "dropdown.option.90days": "90 Days",
  "dropdown.option.6months": "6 Months",
  "dropdown.option.1year": "1 Year",
};

const meta = {
  title: "Components/DatePicker/DataRangeDropdown",
  component: DateRangeDropdown,
  decorators: [
    (Story) => (
      <IntlProvider locale="en-US" messages={messages}>
        <div className="w-[260px]">
          <Story />
        </div>
      </IntlProvider>
    ),
  ],
} satisfies Meta<typeof DateRangeDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

function RangeDropdownStory() {
  const [value, setValue] = React.useState<number | undefined>(90);

  return <DateRangeDropdown value={value} onRangeChange={setValue} onClear={() => setValue(undefined)} />;
}

export const Default: Story = {
  args: {
    value: 90,
    onRangeChange: () => {},
    onClear: () => {},
  },
  render: () => <RangeDropdownStory />,
};
