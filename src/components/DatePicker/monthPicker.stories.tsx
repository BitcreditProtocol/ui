import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { LanguageContext } from "@/components/context/language/LanguageContext";

import { MonthPicker } from "./monthPicker";

const locale = "en-US";

const meta = {
  title: "Components/DatePicker/MonthPicker",
  component: MonthPicker,
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
} satisfies Meta<typeof MonthPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

function MonthPickerStory() {
  const [value, setValue] = React.useState(new Date(2026, 3, 16));

  return <MonthPicker value={value} onChange={setValue} onCaptionLabelClicked={() => {}} shouldDisableFutureNavigation />;
}

export const Default: Story = {
  args: {
    value: new Date(2026, 3, 16),
    onChange: () => {},
    onCaptionLabelClicked: () => {},
  },
  render: () => <MonthPickerStory />,
};
