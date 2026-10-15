export type BackPageEndorsement = {
  label: string;
  payeeName: string;
  payeeAddressLine1: string;
  payeeAddressLine2: string;
  signerName: string;
  signatureName: string;
  signaturePlace: string;
  signatureDate: string;
};

export type BillPdfEndorsement = BackPageEndorsement;

export const BILL_PDF_ENDORSING_BLOCK_TYPES: readonly string[] = ["Endorse", "Mint", "Sell", "Recourse"];

export const billPdfEndorsementLabel = (isPayeeBearer: boolean): string => (isPayeeBearer ? "Pay to" : "Pay to the order of");
