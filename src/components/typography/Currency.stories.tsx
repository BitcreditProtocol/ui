import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IntlProvider } from "react-intl";

import { PreferencesProvider } from "@/components/context/preferences/PreferencesProvider";
import type { Rates } from "@/lib/currency";

import { Currency } from "./Currency";

const mockRates: Rates = { usdPerBtc: 65_000, eurPerUsd: 0.92 };

function makeQueryClient(rates?: Rates) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  if (rates) {
    client.setQueryData(["rates", "coinbase"], rates);
  }
  return client;
}

const meta = {
  title: "Typography/Currency",
  component: Currency,
  decorators: [
    (Story) => (
      <IntlProvider locale="en-US">
        <PreferencesProvider>
          <Story />
        </PreferencesProvider>
      </IntlProvider>
    ),
  ],
} satisfies Meta<typeof Currency>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 0,
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Currency value={1234.56} currency="USD" />
      <Currency value={-1234.56} currency="EUR" />
      <Currency value={0.12345678} currency="BTC" currencyDisplay="code" />
      <Currency value={123456} currency="SAT" currencyDisplay="code" />
    </div>
  ),
};

export const WithClassNames: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Currency value={1234.56} currency="USD" amountClassName="font-bold text-lg" currencyClassName="text-muted-foreground" />
      <Currency value={123456} currency="SAT" amountClassName="font-mono" currencyClassName="text-xs uppercase tracking-widest" />
    </div>
  ),
};

export const WithHighlight: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Currency value={1234.56} currency="USD" highlightQuery="1,234" />
      <Currency value={123456} currency="SAT" currencyDisplay="code" highlightQuery="123" />
    </div>
  ),
};

export const WithSecondary: Story = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={makeQueryClient(mockRates)}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  render: () => (
    <div className="flex flex-col gap-4">
      <Currency value={100000} sourceCurrency="sat" />
      <Currency value={0.001} sourceCurrency="btc" />
      <Currency value={50} sourceCurrency="usd" />
    </div>
  ),
};

export const SecondaryToggle: Story = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={makeQueryClient(mockRates)}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  render: () => (
    <div className="flex flex-col gap-3">
      <span className="text-xs text-muted-foreground">showSecondary=true (default)</span>
      <Currency value={100000} sourceCurrency="sat" showSecondary={true} />
      <span className="text-xs text-muted-foreground">showSecondary=false</span>
      <Currency value={100000} sourceCurrency="sat" showSecondary={false} />
    </div>
  ),
};
