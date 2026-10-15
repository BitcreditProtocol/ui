import { type BackPageLabels, DEFAULT_BACK_PAGE_LABELS } from "../backPage/backPageLabels";
import type { AmountToWordsLabels } from "../utils/amountToWords";

export type FrontPageLabels = {
  international: string;
  billOfExchange: string;
  placeAndDateOfIssue: string;
  placeOfPayment: string;
  againstThisBill: string;
  toTheOrderOf: string;
  amount: string;
  amountInWords: string;
  payer: string;
  issuer: string;
  signatures: string;
  accepted: string;
  signatureLabel: string;
  paymentInstructions: string;
  signatureOfAccepted: string;
  front: string;
  againstValue: string;
  noProtest: string;
  pageNumber: (values: { current: number; total: number }) => string;
  amountWords: AmountToWordsLabels;
};

export type BillPdfLabels = FrontPageLabels & BackPageLabels;

export const DEFAULT_BILL_PDF_LABELS: BillPdfLabels = {
  international: "International",
  billOfExchange: "Bill of exchange",
  placeAndDateOfIssue: "Place and date of issue",
  placeOfPayment: "Place of payment",
  againstThisBill: "Against this bill of exchange pay on",
  toTheOrderOf: "to the order of",
  amount: "Amount",
  amountInWords: "Amount in words",
  payer: "Payer:",
  issuer: "Issuer:",
  signatures: "Signature:",
  accepted: "Accepted:",
  signatureLabel: "Signature:",
  paymentInstructions: "Payment instruction:",
  signatureOfAccepted: "Signature of the acceptor",
  front: "Front",
  againstValue: "Against value.",
  noProtest: "No protest.",
  pageNumber: ({ current, total }) => `${String(current)} of ${String(total)}`,
  amountWords: {
    ones: [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ],
    tens: ["zero", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
    orders: ["zero", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion"],
    hundred: "hundred",
    bitcoin: "Bitcoin",
    point: "point",
  },
  ...DEFAULT_BACK_PAGE_LABELS,
};
