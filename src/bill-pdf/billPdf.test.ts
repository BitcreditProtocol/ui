import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  type BillPdfContent,
  type BillPdfEndorsement,
  billPdfAmountInWords,
  billPdfEndorsementLabel,
  btcAmountToWords,
  createBillPdf,
  DEFAULT_BILL_PDF_LABELS,
  formatBillPdfAddressLines,
  formatBillPdfAmount,
  formatBillPdfDate,
  formatBillPdfLocation,
} from "./index";

const words = DEFAULT_BILL_PDF_LABELS.amountWords;

const content: BillPdfContent = {
  issuingPlace: "Vienna, AT, Jan 21, 2026",
  paymentPlace: "Vienna, AT",
  maturityDate: "Apr 21, 2026",
  payeeName: "Mint GmbH",
  payeeAddress: "Ring 1, 1010 Vienna, AT",
  amountDisplay: "0.00150000 XBT",
  amountInWords: "Bitcoin zero point zero zero one five zero zero zero zero",
  payerName: "Payer AG",
  payerSignatureName: "Anna Payer",
  payerAddress: "Gasse 2, 1020 Vienna, AT",
  payerAddressLine1: "Gasse 2",
  payerAddressLine2: "Vienna, AT 1020",
  issuerName: "Issuer KG",
  issuerSignatureName: "Ivan Issuer",
  issuerAddress: "Platz 3, 1030 Vienna, AT",
  issuerAddressLine1: "Platz 3",
  issuerAddressLine2: "Vienna, AT 1030",
  isAccepted: true,
  isPayeeBearer: false,
  hasInvoice: true,
  isPaymentRequested: true,
  paymentAddress: "bc1qexamplepaymentaddressxxxxxxxxxxxxxxxx",
};

function endorsements(count: number): BillPdfEndorsement[] {
  return Array.from({ length: count }, (_, index) => ({
    label: billPdfEndorsementLabel(false),
    payeeName: `Holder ${index + 1}`,
    payeeAddressLine1: "Street 1",
    payeeAddressLine2: "Vienna, AT 1010",
    signerName: `Signer ${index + 1}`,
    signatureName: `Signer ${index + 1}`,
    signaturePlace: "Vienna",
    signatureDate: "Feb 01, 2026",
  }));
}

describe("amount formatting", () => {
  it("writes sat amounts as XBT with eight decimals", () => {
    expect(formatBillPdfAmount("150000", "sat")).toBe("0.00150000 XBT");
    expect(formatBillPdfAmount("1", "BTC")).toBe("1.00 XBT");
    expect(formatBillPdfAmount("1234.5", "EUR")).toBe("1,234.50 EUR");
  });

  it("spells out bitcoin amounts digit by digit after the point", () => {
    expect(btcAmountToWords("21.00000000", words)).toBe("Bitcoin twenty-one");
    expect(btcAmountToWords("1.5", words)).toBe("Bitcoin one point five zero zero zero zero zero zero zero");
    expect(billPdfAmountInWords("150000", "sat", words)).toBe("Bitcoin zero point zero zero one five zero zero zero zero");
  });

  it("prints a non-bitcoin amount as the figure", () => {
    expect(billPdfAmountInWords("10", "EUR", words)).toBe("10.00 EUR");
  });
});

describe("address and place formatting", () => {
  it("splits an address into street and city lines", () => {
    expect(formatBillPdfAddressLines({ address: "Ring 1", zip: "1010", city: "Vienna", country: "AT" })).toEqual({
      line1: "Ring 1",
      line2: "Vienna, AT 1010",
    });
    expect(formatBillPdfAddressLines(undefined)).toEqual({ line1: "-", line2: "-" });
  });

  it("prints a calendar date on its own day in every time zone", () => {
    // `new Date("2026-01-21")` is UTC midnight, the previous evening anywhere west of UTC.
    expect(formatBillPdfDate("2026-01-21")).toBe("Jan 21, 2026");
    expect(
      new Date("2026-01-21").toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/New_York" })
    ).toBe("Jan 20, 2026");
  });

  it("joins the place of issue with its date and drops empty parts", () => {
    expect(formatBillPdfLocation("Vienna", "AT", "2026-01-21")).toBe("Vienna, AT, Jan 21, 2026");
    expect(formatBillPdfLocation(undefined, undefined)).toBe("-");
  });

  it("pays a bearer directly and a named endorsee to their order", () => {
    expect(billPdfEndorsementLabel(true)).toBe("Pay to");
    expect(billPdfEndorsementLabel(false)).toBe("Pay to the order of");
  });
});

describe("createBillPdf", () => {
  // Under vitest an imported font is a path inside the repo; the browser build inlines it.
  beforeEach(() => {
    vi.stubGlobal("fetch", async (url: string) => {
      const bytes = await readFile(path.join(process.cwd(), url));
      // pdf-lib checks `instanceof ArrayBuffer`, so copy into this environment's own ArrayBuffer.
      const buffer = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(buffer).set(bytes);
      return { arrayBuffer: async () => buffer };
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    [0, 1],
    [5, 1],
    [6, 2],
    [11, 2],
    [16, 3],
  ])(
    "prints %i endorsements on %i sheet(s): the front, then five endorsements per back panel, two panels a sheet",
    async (count, sheets) => {
      const bytes = await createBillPdf(content, endorsements(count));

      expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
      expect((await PDFDocument.load(bytes)).getPageCount()).toBe(sheets);
    }
  );

  it("prints a bearer bill that is neither accepted nor requested to pay", async () => {
    const bytes = await createBillPdf(
      {
        ...content,
        isAccepted: false,
        isPayeeBearer: true,
        payeeName: "Bearer",
        payeeAddress: "",
        isPaymentRequested: false,
        paymentAddress: "",
      },
      [],
      { footerText: "Copy for the mint's records." }
    );

    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
  });
});
