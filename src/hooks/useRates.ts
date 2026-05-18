import type { QueryFunctionContext } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { FiatCurrencyCode } from "@/constants/currencies";
import { FIAT_CURRENCY_CODES_SET } from "@/constants/currencies";
import type { Rates } from "@/lib/currency";

type CoinbaseResponse = {
  data?: {
    currency?: string;
    rates?: Record<string, string>;
  };
};

async function fetchCoinbaseRates(signal?: AbortSignal): Promise<Rates> {
  const url = "https://api.coinbase.com/v2/exchange-rates?currency=BTC";
  const res = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const statusText = text || res.statusText || String(res.status);
    throw new Error(`Coinbase request failed: ${statusText}`);
  }

  const response = (await res.json()) as CoinbaseResponse;
  const rawRates = response.data?.rates;

  if (!rawRates || typeof rawRates !== "object") {
    throw new Error("Unexpected Coinbase payload: missing rates");
  }

  const rates: Rates = {};
  for (const [key, value] of Object.entries(rawRates)) {
    const code = key.toLowerCase();
    const num = parseFloat(value);
    if (FIAT_CURRENCY_CODES_SET.has(code as FiatCurrencyCode) && isFinite(num) && num > 0) {
      rates[code as FiatCurrencyCode] = num;
    }
  }

  if (!rates.usd || !rates.eur) {
    throw new Error("Unexpected Coinbase payload: missing rates.USD or rates.EUR");
  }

  return rates;
}

export function useRates() {
  return useQuery<Rates>({
    queryKey: ["rates", "coinbase"],
    queryFn: async ({ signal }: QueryFunctionContext) => {
      try {
        return await fetchCoinbaseRates(signal);
      } catch (error) {
        console.error("[useRates] Failed to fetch rates", error);
        throw error;
      }
    },
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 300_000,
    retry: (failureCount: number, error: Error) => {
      if (failureCount >= 3) {
        return false;
      }
      const message = error.message || "";
      return /429|5\d\d|network|fetch/i.test(message);
    },
    retryDelay: (attempt: number) => Math.min(1000 * Math.pow(2, attempt), 10_000),
  });
}
