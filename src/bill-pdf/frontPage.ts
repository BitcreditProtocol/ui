import { type PDFDocument, type PDFFont, type PDFImage, rgb } from "pdf-lib";

import type { BillPdfContent } from "./frontPage/billPdfData";
import type { FrontPageLabels } from "./frontPage/billPdfLabels";
import { renderFrontPageHeader } from "./frontPage/frontPageHeader";
import { renderFrontPageParties } from "./frontPage/frontPageParties";
import { BILL_PDF_PANEL_SIZE } from "./utils/billPdfLayout";
import { drawPageNumber } from "./utils/pdfPageUtils";
import { truncatePdfLeadingSegmentToFit, truncatePdfTextToFit } from "./utils/pdfTextTruncation";

export function renderFrontPage(
  pdfDoc: PDFDocument,
  content: BillPdfContent,
  labels: FrontPageLabels,
  logoImage: PDFImage,
  morionFont: PDFFont,
  interFont: PDFFont,
  interSemiBoldFont: PDFFont,
  geistMonoFont: PDFFont,
  geistMonoMediumFont: PDFFont,
  geistMonoRegularFont: PDFFont,
  malvinasFont: PDFFont,
  pageNumber: number,
  totalPages: number
) {
  const page = pdfDoc.addPage([BILL_PDF_PANEL_SIZE.width, BILL_PDF_PANEL_SIZE.height]);

  const { width, height } = page.getSize();
  const backgroundColor = rgb(0xfe / 255, 0xfb / 255, 0xf1 / 255);
  const leftPanelWidth = 140;
  const acceptancePanelWidth = 90;
  const contentLeft = leftPanelWidth + acceptancePanelWidth + 11;
  const contentRight = width;
  const top = height;

  const lineColor = rgb(0.85, 0.84, 0.82);
  const textMuted = rgb(0.55, 0.52, 0.47);
  const textPrimary = rgb(0.11, 0.06, 0.0);
  const acceptedAccent = rgb(0, 0, 0.67);

  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: backgroundColor,
  });

  const { billInfoDividerX, signatureSize, issuerSignatureText } = renderFrontPageHeader({
    page,
    height,
    labels,
    content,
    logoImage,
    morionFont,
    interFont,
    interSemiBoldFont,
    geistMonoMediumFont,
    geistMonoRegularFont,
    malvinasFont,
    lineColor,
    textMuted,
    textPrimary,
    leftPanelWidth,
    acceptancePanelWidth,
  });

  // Bill information
  // Place and date of issue
  const billInfoLeft = billInfoDividerX + 27;
  const issuingPlaceSize = 8;
  const issuingPlaceText = truncatePdfLeadingSegmentToFit(geistMonoRegularFont, issuingPlaceSize, content.issuingPlace, 312);

  page.drawText(issuingPlaceText, {
    x: billInfoLeft,
    y: 250,
    size: issuingPlaceSize,
    font: geistMonoRegularFont,
    color: rgb(0, 0, 0.67),
  });

  page.drawLine({
    start: { x: billInfoLeft, y: 245 },
    end: { x: billInfoLeft + 314, y: 245 },
    thickness: 1,
    color: lineColor,
  });

  page.drawText(labels.placeAndDateOfIssue, {
    x: billInfoLeft,
    y: 235,
    size: 6,
    font: interSemiBoldFont,
    color: textMuted,
  });

  // Place of payment
  const billInfoLeftPaymentPlace = billInfoDividerX + 363;
  const paymentPlaceText = truncatePdfLeadingSegmentToFit(geistMonoRegularFont, 8, content.paymentPlace, 220, 1);
  page.drawText(paymentPlaceText, {
    x: billInfoLeftPaymentPlace,
    y: 250,
    size: 8,
    font: geistMonoRegularFont,
    color: rgb(0, 0, 0.67),
  });

  page.drawLine({
    start: { x: billInfoLeft + 334, y: 245 },
    end: { x: billInfoLeft + 334 + 220, y: 245 },
    thickness: 1,
    color: lineColor,
  });

  page.drawText(labels.placeOfPayment, {
    x: billInfoLeftPaymentPlace,
    y: 235,
    size: 6,
    font: interSemiBoldFont,
    color: textMuted,
  });

  // Against this bill of exchange pay on
  const againstThisBillX = billInfoLeft;
  const againstThisBillY = 211;
  page.drawText(labels.againstThisBill, {
    x: againstThisBillX,
    y: againstThisBillY,
    size: 14,
    font: interSemiBoldFont,
    color: textPrimary,
  });

  page.drawText(content.maturityDate, {
    x: againstThisBillX + 253,
    y: 213,
    size: 8,
    font: geistMonoRegularFont,
    color: rgb(0, 0, 0.67),
  });

  page.drawLine({
    start: { x: againstThisBillX + 253, y: 207 },
    end: { x: againstThisBillX + 253 + 130, y: 207 },
    thickness: 1,
    color: lineColor,
  });

  // Amount box
  const placeOfPaymentTopLineY = 245;
  const amountBox = {
    x: contentRight - 8 - 156,
    y: placeOfPaymentTopLineY - 7 - 22,
    width: 156,
    height: 22,
  };
  const amountLineColor = rgb(0xec / 255, 0xe8 / 255, 0xde / 255); // #ECE8DE
  const amountLineCount = 11;
  const amountLineThickness = 1;
  const amountLineSpacing = 1;
  for (let i = 0; i < amountLineCount; i += 1) {
    const y = amountBox.y + i * (amountLineThickness + amountLineSpacing);
    page.drawLine({
      start: { x: amountBox.x, y },
      end: { x: amountBox.x + amountBox.width, y },
      thickness: amountLineThickness,
      color: amountLineColor,
    });
  }

  const amountTextWidth = geistMonoRegularFont.widthOfTextAtSize(content.amountDisplay, 8);
  const amountTextSize = 8;
  const amountTextHeight = geistMonoRegularFont.heightAtSize(amountTextSize, {
    descender: true,
  });
  page.drawText(content.amountDisplay, {
    x: amountBox.x + (amountBox.width - amountTextWidth) / 2,
    y: amountBox.y + (amountBox.height - amountTextHeight) / 2,
    size: amountTextSize,
    font: geistMonoRegularFont,
    color: rgb(0, 0, 0.67),
  });

  const amountLabelSize = 6;
  const amountLabelWidth = interSemiBoldFont.widthOfTextAtSize(labels.amount, amountLabelSize);
  const amountLabelY = amountBox.y - 9;
  page.drawText(labels.amount, {
    x: amountBox.x + (amountBox.width - amountLabelWidth) / 2,
    y: amountLabelY,
    size: amountLabelSize,
    font: interSemiBoldFont,
    color: textMuted,
  });

  // to the order of
  const toTheOrderOfX = billInfoLeft;
  const toTheOrderOfY = 183 + 6;
  page.drawText(labels.toTheOrderOf, {
    x: toTheOrderOfX,
    y: toTheOrderOfY,
    size: 12,
    font: interSemiBoldFont,
    color: textPrimary,
  });

  const payeeTextWidth = 292;
  const payeeNameText = truncatePdfTextToFit(geistMonoRegularFont, 8, content.payeeName, payeeTextWidth);

  page.drawText(payeeNameText, {
    x: billInfoLeft + 92,
    y: 187 + 3,
    size: 8,
    font: geistMonoRegularFont,
    color: rgb(0, 0, 0.67),
  });

  page.drawLine({
    start: { x: 326, y: 184 },
    end: { x: 326 + 292, y: 184 },
    thickness: 1,
    color: lineColor,
  });

  const payeeAddressText = truncatePdfLeadingSegmentToFit(geistMonoRegularFont, 8, content.payeeAddress, payeeTextWidth);

  page.drawText(payeeAddressText, {
    x: billInfoLeft + 92,
    y: 168 + 3,
    size: 8,
    font: geistMonoRegularFont,
    color: rgb(0, 0, 0.67),
  });

  // Against value. No protest. (shown only when no invoice is attached)
  const againstValueBox = {
    x: amountBox.x + 1,
    width: amountBox.width - 2,
    height: 36,
  };
  const againstValueBoxTopY = amountLabelY - 8;
  page.drawRectangle({
    x: againstValueBox.x,
    y: againstValueBoxTopY - againstValueBox.height,
    width: againstValueBox.width,
    height: againstValueBox.height,
    borderColor: lineColor,
    borderWidth: 1,
  });
  const againstValueBoxBottomY = againstValueBoxTopY - againstValueBox.height;

  page.drawLine({
    start: { x: 326, y: againstValueBoxBottomY },
    end: { x: 326 + 292, y: againstValueBoxBottomY },
    thickness: 1,
    color: lineColor,
  });

  const againstValueTextX = againstValueBox.x + 8;
  const againstValueTextSize = 8;
  const againstValueTextHeight = geistMonoRegularFont.heightAtSize(againstValueTextSize, { descender: true });
  const againstValueTextTopInset = 4;
  const againstValueBaseY = againstValueBoxTopY - againstValueTextTopInset - againstValueTextHeight;
  const noProtestY = content.hasInvoice ? againstValueBaseY - 12 : againstValueBaseY;

  if (content.hasInvoice) {
    page.drawText(labels.againstValue, {
      x: againstValueTextX,
      y: againstValueBaseY,
      size: againstValueTextSize,
      font: geistMonoRegularFont,
      color: textPrimary,
    });
  }

  page.drawText(labels.noProtest, {
    x: againstValueTextX,
    y: noProtestY,
    size: againstValueTextSize,
    font: geistMonoRegularFont,
    color: textPrimary,
  });

  // Amount in words
  const amountWordsBox = {
    x: contentLeft - 6,
    y: 155,
    width: 561,
    height: 22,
  };

  const amountWordsLineColor = rgb(0xec / 255, 0xe8 / 255, 0xde / 255);
  const amountWordsLineCount = 11;
  const amountWordsFirstLineY = 155;
  const amountWordsLineThickness = 1;
  const amountWordsLineSpacing = 1;
  const amountWordsLastLineY = amountWordsFirstLineY - (amountWordsLineCount - 1) * (amountWordsLineThickness + amountWordsLineSpacing);
  for (let i = 0; i < amountWordsLineCount; i += 1) {
    const y = amountWordsFirstLineY - i * (amountWordsLineThickness + amountWordsLineSpacing);
    page.drawLine({
      start: { x: amountWordsBox.x, y },
      end: { x: amountWordsBox.x + amountWordsBox.width, y },
      thickness: amountWordsLineThickness,
      color: amountWordsLineColor,
    });
  }

  const amountWordsText = content.amountInWords.toUpperCase();
  const amountWordsWidth = geistMonoRegularFont.widthOfTextAtSize(amountWordsText, 8);
  const amountWordsTextHeight = geistMonoRegularFont.heightAtSize(8, {
    descender: true,
  });
  const amountWordsBandHeight = amountWordsFirstLineY - amountWordsLastLineY;
  const amountWordsTextY = amountWordsLastLineY + (amountWordsBandHeight - amountWordsTextHeight) / 2;
  page.drawText(amountWordsText, {
    x: amountWordsBox.x + (amountWordsBox.width - amountWordsWidth) / 2,
    y: amountWordsTextY + 2,
    size: 8,
    font: geistMonoRegularFont,
    color: rgb(0, 0, 0.67),
  });

  const amountWordsLabelSize = 6;
  const amountWordsLabelWidth = interFont.widthOfTextAtSize(labels.amountInWords, 6);
  const amountWordsLabelHeight = interFont.heightAtSize(amountWordsLabelSize, {
    descender: true,
  });
  const amountWordsLabelY = amountWordsLastLineY - 4 - amountWordsLabelHeight;
  page.drawText(labels.amountInWords, {
    x: amountWordsBox.x + (amountWordsBox.width - amountWordsLabelWidth) / 2,
    y: amountWordsLabelY + 3,
    size: amountWordsLabelSize,
    font: interFont,
    color: textMuted,
  });

  renderFrontPageParties({
    page,
    billInfoLeft,
    contentRight,
    top,
    labels,
    content,
    issuerSignatureText,
    signatureSize,
    interSemiBoldFont,
    geistMonoFont,
    geistMonoMediumFont,
    geistMonoRegularFont,
    malvinasFont,
    lineColor,
    textMuted,
    acceptedAccent,
  });

  drawPageNumber(
    page,
    labels.pageNumber({ current: pageNumber, total: totalPages }),
    contentRight - 5,
    5,
    geistMonoRegularFont,
    textMuted,
    { size: 8, align: "right" }
  );
}
