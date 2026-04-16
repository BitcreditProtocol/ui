import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { IntlProvider } from "react-intl";

import { LanguageContext } from "@/components/context/language/LanguageContext";
import type { DateRange } from "@/utils/dates";

import { DatePicker } from "./datePicker";

const locale = "en-US";

const messages = {
  "displayRange.days": "{value} days",
  "displayRange.sixMonths": "6 Months",
  "displayRange.oneYear": "1 Year",
  "displayRange.selectRange": "Select range",
  "dropdown.option.30days": "30 Days",
  "dropdown.option.60days": "60 Days",
  "dropdown.option.90days": "90 Days",
  "dropdown.option.6months": "6 Months",
  "dropdown.option.1year": "1 Year",
  "bills.list.filter.by": "Filter by",
  "bills.list.filter.date.issue": "Issue date",
  "bills.list.filter.date.maturity": "Maturity date",
  "datePicker.range.selectRange": "Select date range",
  "datePicker.range.start": "Start",
  "datePicker.range.end": "End",
  "datePicker.single.selectedDate": "Selected date",
  "datePicker.actions.cancel": "Cancel",
  "datePicker.actions.confirm": "Confirm",
};

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  decorators: [
    (Story) => (
      <IntlProvider locale={locale} messages={messages}>
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
      </IntlProvider>
    ),
  ],
  args: {
    onChange: () => {},
  },
  argTypes: {
    mode: {
      options: ["single", "range"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

function SingleDateStory() {
  const [value, setValue] = React.useState<DateRange | undefined>({
    from: new Date(2026, 3, 16),
  });

  return <DatePicker mode="single" value={value} onChange={setValue} label="Choose a date" />;
}

function RangeDateStory() {
  const [value, setValue] = React.useState<DateRange | undefined>({
    from: new Date(2026, 3, 10),
    to: new Date(2026, 3, 18),
  });

  return <DatePicker mode="range" value={value} onChange={setValue} onDateFilterTypeChange={() => {}} />;
}

function RangeWithPresetsStory() {
  const [value, setValue] = React.useState<DateRange | undefined>({
    from: new Date(2026, 2, 1),
    to: new Date(2026, 2, 31),
  });
  const [dateFilterType, setDateFilterType] = React.useState<"issue" | "maturity">("issue");

  return (
    <DatePicker
      mode="range"
      value={value}
      onChange={setValue}
      dateFilterType={dateFilterType}
      onDateFilterTypeChange={setDateFilterType}
      isFutureNavigationDisabled
      currentYearPosition="center"
    />
  );
}

export const SingleDate: Story = {
  args: {
    mode: "single",
  },
  render: () => <SingleDateStory />,
};

export const RangeDate: Story = {
  args: {
    mode: "range",
  },
  render: () => <RangeDateStory />,
};

export const RangeWithPresets: Story = {
  args: {
    mode: "range",
  },
  render: () => <RangeWithPresetsStory />,
};
