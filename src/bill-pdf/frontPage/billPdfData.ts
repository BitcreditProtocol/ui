import Big from "big.js";

import { type AmountToWordsLabels, btcAmountToWords } from "../utils/amountToWords";

export type BillPdfContent = {
  issuingPlace: string;
  paymentPlace: string;
  maturityDate: string;
  payeeName: string;
  payeeAddress: string;
  amountDisplay: string;
  amountInWords: string;
  payerName: string;
  payerSignatureName: string;
  payerAddress?: string;
  payerAddressLine1: string;
  payerAddressLine2: string;
  issuerName: string;
  issuerSignatureName: string;
  issuerAddress?: string;
  issuerAddressLine1: string;
  issuerAddressLine2: string;
  isAccepted: boolean;
  isPayeeBearer: boolean;
  hasInvoice: boolean;
  isPaymentRequested: boolean;
  paymentAddress: string;
};

export type BillPdfPostalAddress = {
  address: string;
  zip?: string | null;
  city: string;
  country: string;
};

export const BILL_PDF_BEARER_NAME = "Bearer";

export const formatBillPdfDate = (value?: string): string => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

export const formatBillPdfDateFromSeconds = (seconds: number): string => {
  if (!Number.isFinite(seconds)) return "-";
  const date = new Date(seconds * 1000);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatBillPdfLocation = (city?: string, country?: string, date?: string): string =>
  [city, country, date ? formatBillPdfDate(date) : undefined].filter(Boolean).join(", ") || "-";

export const formatBillPdfAmount = (sum: string, currency: string): string => {
  const normalizedCurrency = currency.toUpperCase();
  const displayCurrency = normalizedCurrency === "BTC" ? "XBT" : currency;
  const parsed = Number(sum);
  if (normalizedCurrency === "SAT" || normalizedCurrency === "SATS") {
    try {
      const btcValue = new Big(sum).div(100000000);
      const btcFixed = btcValue.toFixed(8);
      const btcNumber = Number(btcFixed);
      const btcDisplay = Number.isFinite(btcNumber)
        ? new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 8,
            maximumFractionDigits: 8,
          }).format(btcNumber)
        : btcFixed;
      return `${btcDisplay} XBT`;
    } catch (error) {
      console.warn("Failed to format SAT amount as BTC:", error);
    }
  }
  if (Number.isFinite(parsed)) {
    return `${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parsed)} ${displayCurrency}`;
  }
  return `${sum} ${displayCurrency}`;
};

export const billPdfAmountInWords = (sum: string, currency: string, amountWordsLabels: AmountToWordsLabels): string => {
  const display = formatBillPdfAmount(sum, currency);
  const normalizedCurrency = currency.toUpperCase();
  if (normalizedCurrency === "SAT" || normalizedCurrency === "SATS") {
    try {
      const btcValue = new Big(sum).div(100000000);
      return btcAmountToWords(btcValue.toFixed(8), amountWordsLabels);
    } catch (error) {
      console.warn("Failed to format SAT amount words:", error);
      return display;
    }
  }

  if (normalizedCurrency === "BTC") {
    try {
      const btcValue = new Big(sum);
      return btcAmountToWords(btcValue.toFixed(8), amountWordsLabels);
    } catch (error) {
      console.warn("Failed to format BTC amount words:", error);
      return display;
    }
  }

  return display;
};

export const formatBillPdfAddress = (postalAddress: BillPdfPostalAddress | null | undefined): string => {
  if (!postalAddress) return "-";
  const { address, zip, city, country } = postalAddress;
  return [address, [zip, city].filter(Boolean).join(" "), country].filter(Boolean).join(", ");
};

export const formatBillPdfAddressLines = (postalAddress: BillPdfPostalAddress | null | undefined): { line1: string; line2: string } => {
  if (!postalAddress) {
    return { line1: "-", line2: "-" };
  }
  const { address, zip, city, country } = postalAddress;
  const cityCountry = [city, country].filter(Boolean).join(", ");
  const cityCountryZip = [cityCountry, zip].filter(Boolean).join(" ");
  return {
    line1: address.trim() || "-",
    line2: cityCountryZip || "-",
  };
};

export const formatBillPdfPlace = (postalAddress: BillPdfPostalAddress | null | undefined): string => {
  if (!postalAddress) return "-";
  return postalAddress.city || postalAddress.country || "-";
};
