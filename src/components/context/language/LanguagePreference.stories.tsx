import type { Meta, StoryObj } from "@storybook/react-vite";
import { GlobeIcon } from "lucide-react";
import * as React from "react";
import { IntlProvider } from "react-intl";

import { AppIcon } from "@/components/ui/app-icon";

import MenuOption from "../MenuOption";
import LanguagePreference from "./LanguagePreference";

const meta = {
  title: "Context/LanguagePreference",
  component: LanguagePreference,
  decorators: [
    (Story) => (
      <IntlProvider locale="en">
        <Story />
      </IntlProvider>
    ),
  ],
} satisfies Meta<typeof LanguagePreference>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "en-US",
    values: [],
    onChange: () => {},
  },
  render: () => {
    const [value, setValue] = React.useState("en-US");

    return (
      <LanguagePreference value={value} values={[]} onChange={setValue}>
        <MenuOption icon={<AppIcon icon={GlobeIcon} className="text-text-300" size="lg" />} label="Language" defaultValue={value} />
      </LanguagePreference>
    );
  },
};

export const FilteredLocales: Story = {
  args: {
    value: "de-DE",
    values: ["de", "en"],
    onChange: () => {},
  },
  render: () => {
    const [value, setValue] = React.useState("de-DE");

    return (
      <LanguagePreference value={value} values={["de", "en"]} onChange={setValue}>
        <MenuOption icon={<AppIcon icon={GlobeIcon} className="text-text-300" size="lg" />} label="Language" defaultValue={value} />
      </LanguagePreference>
    );
  },
};
