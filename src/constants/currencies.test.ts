import { describe, expect, it } from "vitest";

import { FIAT_CURRENCY_CODES, PINNED_FIAT_CURRENCY_CODES } from "./currencies";

describe("currency ordering", () => {
  it("pins major fiat currencies below BTC and sat in the requested order", () => {
    expect(PINNED_FIAT_CURRENCY_CODES).toEqual(["usd", "cny", "eur", "gbp", "jpy"]);
    expect(FIAT_CURRENCY_CODES.slice(0, PINNED_FIAT_CURRENCY_CODES.length)).toEqual(PINNED_FIAT_CURRENCY_CODES);
  });

  it("orders the remaining fiat currencies alphabetically", () => {
    const remaining = FIAT_CURRENCY_CODES.slice(PINNED_FIAT_CURRENCY_CODES.length);

    expect(remaining).toEqual([...remaining].sort());
  });
});
