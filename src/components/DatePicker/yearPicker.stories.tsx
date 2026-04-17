import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { LanguageContext } from "@/components/context/language/LanguageContext";

import { YearPicker } from "./yearPicker";

const locale = "en-US";

const meta = {
  title: "Components/DatePicker/YearPicker",
  component: YearPicker,
  decorators: [
    (Story) => (
      <LanguageContext.Provider
        value={{
          locale,
          setLocale: () => {},
          availableLocales: () => [locale],
        }}
      >
        <div className="w-[320px]">
          <Story />
        </div>
      </LanguageContext.Provider>
    ),
  ],
} satisfies Meta<typeof YearPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

function YearPickerStory() {
  const [value, setValue] = React.useState(new Date(2026, 3, 16));

  return <YearPicker value={value} onChange={setValue} onCaptionLabelClicked={() => {}} currentYearPosition="center" />;
}

export const Default: Story = {
  args: {
    value: new Date(2026, 3, 16),
    onChange: () => {},
    onCaptionLabelClicked: () => {},
  },
  render: () => <YearPickerStory />,
};
