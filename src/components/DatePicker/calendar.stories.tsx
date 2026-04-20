import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { LanguageContext } from "@/components/context/language/LanguageContext";
import type { DateRange } from "@/utils/dates";

import { Calendar } from "./calendar";

const locale = "en-US";

const meta = {
  title: "Components/DatePicker/Calendar",
  component: Calendar,
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
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

function SingleCalendarStory() {
  const [selected, setSelected] = React.useState<DateRange>({
    from: new Date(2026, 3, 16),
  });

  return (
    <Calendar
      mode="single"
      selected={selected}
      month={selected.from}
      onCaptionLabelClicked={() => {}}
      onSelect={(_range, selectedDay) => {
        setSelected({ from: selectedDay, to: undefined });
      }}
    />
  );
}

function RangeCalendarStory() {
  const [selected, setSelected] = React.useState<DateRange>({
    from: new Date(2026, 3, 10),
    to: new Date(2026, 3, 18),
  });

  return (
    <Calendar
      mode="range"
      selected={selected}
      month={selected.from}
      rangeFocus="to"
      onCaptionLabelClicked={() => {}}
      onSelect={(_range, selectedDay) => {
        setSelected((current) => {
          if (!current.from || (current.from && current.to)) {
            return { from: selectedDay, to: undefined };
          }

          return selectedDay < current.from ? { from: selectedDay, to: current.from } : { from: current.from, to: selectedDay };
        });
      }}
    />
  );
}

export const Single: Story = {
  args: {
    mode: "single",
    selected: { from: new Date(2026, 3, 16) },
    onSelect: () => {},
    onCaptionLabelClicked: () => {},
  },
  render: () => <SingleCalendarStory />,
};

export const Range: Story = {
  args: {
    mode: "range",
    selected: { from: new Date(2026, 3, 10), to: new Date(2026, 3, 18) },
    onSelect: () => {},
    onCaptionLabelClicked: () => {},
  },
  render: () => <RangeCalendarStory />,
};
