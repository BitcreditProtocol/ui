import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { IntlProvider } from "react-intl";

import { LanguageContext } from "@/components/context/language/LanguageContext.ts";
import type { DateRange } from "@/utils/dates.ts";

import { DatePicker } from "../datePicker.tsx";

const locale = "en-US";

const messages = {
  "bills.list.filter.by": "Filter by",
  "bills.list.filter.date.issue": "Issue date",
  "bills.list.filter.date.maturity": "Maturity date",
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

  return <DatePicker mode="single" value={value} onChange={setValue} label="Choose a date" shouldDisplayIncrementButtons />;
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
      shouldDisplayIncrementButtons
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

function SingleDateWithTimeStory() {
  const [value, setValue] = React.useState<DateRange | undefined>({
    from: new Date(2026, 3, 16, 9, 30),
  });

  return <DatePicker mode="single" value={value} onChange={setValue} label="Choose a date and time" withTime />;
}

function SingleDateWithTime12hStory() {
  const [value, setValue] = React.useState<DateRange | undefined>({
    from: new Date(2026, 3, 16, 14, 45),
  });

  return <DatePicker mode="single" value={value} onChange={setValue} label="Choose a date and time" withTime timeFormat="12h" />;
}

function RangeDateWithTimeStory() {
  const [value, setValue] = React.useState<DateRange | undefined>({
    from: new Date(2026, 3, 10, 8, 0),
    to: new Date(2026, 3, 18, 17, 0),
  });

  return <DatePicker mode="range" value={value} onChange={setValue} onDateFilterTypeChange={() => {}} withTime />;
}

function RangeDateWithTime12hStory() {
  const [value, setValue] = React.useState<DateRange | undefined>({
    from: new Date(2026, 3, 10, 8, 0),
    to: new Date(2026, 3, 18, 17, 0),
  });

  return <DatePicker mode="range" value={value} onChange={setValue} onDateFilterTypeChange={() => {}} withTime timeFormat="12h" />;
}

export const SingleDateWithTime: Story = {
  args: { mode: "single" },
  render: () => <SingleDateWithTimeStory />,
};

export const SingleDateWithTime12h: Story = {
  args: { mode: "single" },
  render: () => <SingleDateWithTime12hStory />,
};

export const RangeDateWithTime: Story = {
  args: { mode: "range" },
  render: () => <RangeDateWithTimeStory />,
};

export const RangeDateWithTime12h: Story = {
  args: { mode: "range" },
  render: () => <RangeDateWithTime12hStory />,
};
