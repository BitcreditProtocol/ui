import { degrees, type PDFFont, type PDFImage, type PDFPage, rgb } from "pdf-lib";

import type { BillPdfContent } from "./billPdfData";
import type { FrontPageLabels } from "./billPdfLabels";

type RenderFrontPageHeaderArgs = {
  page: PDFPage;
  height: number;
  labels: FrontPageLabels;
  content: BillPdfContent;
  logoImage: PDFImage;
  morionFont: PDFFont;
  interFont: PDFFont;
  interSemiBoldFont: PDFFont;
  geistMonoMediumFont: PDFFont;
  geistMonoRegularFont: PDFFont;
  malvinasFont: PDFFont;
  lineColor: ReturnType<typeof rgb>;
  textMuted: ReturnType<typeof rgb>;
  textPrimary: ReturnType<typeof rgb>;
  leftPanelWidth: number;
  acceptancePanelWidth: number;
};

type RenderFrontPageHeaderResult = {
  billInfoDividerX: number;
  signatureSize: number;
  signatureText: string;
  issuerSignatureText: string;
};

export function renderFrontPageHeader({
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
}: RenderFrontPageHeaderArgs): RenderFrontPageHeaderResult {
  const measureTrackedWidth = (text: string, font: PDFFont, size: number, tracking: number) => {
    if (text.length === 0) {
      return 0;
    }
    const width = font.widthOfTextAtSize(text, size);
    return width + tracking * (text.length - 1);
  };

  const drawTrackedRotatedText = ({
    text,
    x,
    y,
    size,
    font,
    color,
    tracking,
  }: {
    text: string;
    x: number;
    y: number;
    size: number;
    font: PDFFont;
    color: ReturnType<typeof rgb>;
    tracking: number;
  }) => {
    let cursorY = y;
    for (const glyph of text) {
      page.drawText(glyph, {
        x,
        y: cursorY,
        rotate: degrees(90),
        size,
        font,
        color,
      });
      cursorY += font.widthOfTextAtSize(glyph, size) + tracking;
    }
  };

  page.drawText(labels.front, {
    x: 5,
    y: height - 13,
    size: 8,
    font: geistMonoRegularFont,
    color: textMuted,
  });

  page.drawLine({
    start: { x: 166, y: 0 },
    end: { x: 166, y: height },
    thickness: 1,
    color: lineColor,
  });

  const titleSize = 18;
  const titleTracking = titleSize * 0.03;
  const internationalText = labels.international.toUpperCase();
  const billText = labels.billOfExchange.toUpperCase();
  const trackedInternationalWidth = measureTrackedWidth(internationalText, morionFont, titleSize, titleTracking);
  const trackedBillWidth = measureTrackedWidth(billText, morionFont, titleSize, titleTracking);
  const billY = height / 2 - trackedBillWidth / 2;
  const internationalY = height / 2 - trackedInternationalWidth / 2;

  const logoSize = 40;
  const logoDraw = {
    x: 13,
    y: (height - logoSize) / 2,
    width: logoSize,
    height: logoSize,
  };
  page.drawImage(logoImage, logoDraw);

  const titleThickness = morionFont.heightAtSize(titleSize);
  const titleStartX = logoDraw.x + logoSize + 7 + titleThickness;
  const billTitleX = titleStartX + titleSize + 2;

  drawTrackedRotatedText({
    text: internationalText,
    x: titleStartX - 3,
    y: internationalY,
    size: titleSize,
    font: morionFont,
    color: textPrimary,
    tracking: titleTracking,
  });

  drawTrackedRotatedText({
    text: billText,
    x: billTitleX - 3,
    y: billY,
    size: titleSize,
    font: morionFont,
    color: textPrimary,
    tracking: titleTracking,
  });

  const maxAcceptanceHeight = height - 16;
  const lineStartY = 0;
  const lineEndY = height;
  const lineCenterY = (lineStartY + lineEndY) / 2;
  const acceptedSize = 8;
  const acceptedAndNameOffsetFromTitle = 22;
  const acceptedAndNameLeftX = billTitleX + acceptedAndNameOffsetFromTitle;
  const acceptedX = acceptedAndNameLeftX + interFont.heightAtSize(acceptedSize);
  const acceptedBottomOffset = 24;
  const acceptedLabelHeight = interFont.widthOfTextAtSize(labels.accepted, acceptedSize);
  const acceptedNameGap = 45;
  const maxAcceptedNameHeight = maxAcceptanceHeight - acceptedBottomOffset - acceptedLabelHeight - acceptedNameGap;

  const uppercasePayerName = content.payerName.toUpperCase();
  const uppercaseSize = 10;
  const uppercaseX = acceptedAndNameLeftX + geistMonoMediumFont.heightAtSize(uppercaseSize);
  let uppercaseText = uppercasePayerName;
  let uppercaseWidth = geistMonoMediumFont.widthOfTextAtSize(uppercaseText, uppercaseSize);

  if (uppercaseWidth > maxAcceptedNameHeight) {
    while (uppercaseWidth > maxAcceptedNameHeight - 10 && uppercaseText.length > 1) {
      uppercaseText = uppercaseText.slice(0, -1);
      uppercaseWidth = geistMonoMediumFont.widthOfTextAtSize(`${uppercaseText}...`, uppercaseSize);
    }
    uppercaseText = `${uppercaseText}...`;
    uppercaseWidth = geistMonoMediumFont.widthOfTextAtSize(uppercaseText, uppercaseSize);
  }

  const uppercaseY = lineCenterY - uppercaseWidth / 2;
  const acceptedY = acceptedBottomOffset;

  page.drawText(labels.accepted, {
    x: acceptedX,
    y: acceptedY,
    rotate: degrees(90),
    size: acceptedSize,
    font: interFont,
    color: textMuted,
  });

  if (content.isAccepted) {
    page.drawText(uppercaseText, {
      x: uppercaseX,
      y: uppercaseY,
      rotate: degrees(90),
      size: uppercaseSize,
      font: geistMonoMediumFont,
      color: rgb(0, 0, 0.67),
    });
  }

  page.drawLine({
    start: { x: 142, y: lineStartY },
    end: { x: 142, y: lineEndY },
    thickness: 1,
    color: lineColor,
  });

  const addressSize = 8;
  const addressTextX = 142 + 6 + geistMonoRegularFont.heightAtSize(addressSize);
  let uppercaseAddressText = (content.payerAddress || "-").toUpperCase();
  let uppercaseAddressWidth = geistMonoRegularFont.widthOfTextAtSize(uppercaseAddressText, addressSize);

  if (uppercaseAddressWidth > maxAcceptanceHeight) {
    while (uppercaseAddressWidth > maxAcceptanceHeight - 10 && uppercaseAddressText.length > 1) {
      uppercaseAddressText = uppercaseAddressText.slice(0, -1);
      uppercaseAddressWidth = geistMonoRegularFont.widthOfTextAtSize(`${uppercaseAddressText}...`, addressSize);
    }
    uppercaseAddressText = `${uppercaseAddressText}...`;
    uppercaseAddressWidth = geistMonoRegularFont.widthOfTextAtSize(uppercaseAddressText, addressSize);
  }

  const uppercaseAddressY = lineCenterY - uppercaseAddressWidth / 2;
  if (content.isAccepted) {
    page.drawText(uppercaseAddressText, {
      x: addressTextX,
      y: uppercaseAddressY,
      rotate: degrees(90),
      size: addressSize,
      font: geistMonoRegularFont,
      color: rgb(0, 0, 0.67),
    });
  }

  const signatureLineX = addressTextX + 8;
  const signatureLabelLineX = signatureLineX + 24;

  page.drawLine({
    start: { x: signatureLabelLineX, y: lineStartY },
    end: { x: signatureLabelLineX, y: lineEndY },
    thickness: 1,
    color: lineColor,
  });

  const signatureSize = 24;
  const payerSignatureSize = 24;
  let signatureText = content.payerSignatureName;
  let signatureWidth = malvinasFont.widthOfTextAtSize(signatureText, payerSignatureSize);

  if (signatureWidth > maxAcceptanceHeight) {
    while (signatureWidth > maxAcceptanceHeight - 10 && signatureText.length > 1) {
      signatureText = signatureText.slice(0, -1);
      signatureWidth = malvinasFont.widthOfTextAtSize(`${signatureText}...`, payerSignatureSize);
    }
    signatureText = `${signatureText}...`;
    signatureWidth = malvinasFont.widthOfTextAtSize(signatureText, payerSignatureSize);
  }

  let issuerSignatureText = content.issuerSignatureName;
  let issuerSignatureWidth = malvinasFont.widthOfTextAtSize(issuerSignatureText, signatureSize);

  if (issuerSignatureWidth > maxAcceptanceHeight) {
    while (issuerSignatureWidth > maxAcceptanceHeight - 10 && issuerSignatureText.length > 1) {
      issuerSignatureText = issuerSignatureText.slice(0, -1);
      issuerSignatureWidth = malvinasFont.widthOfTextAtSize(`${issuerSignatureText}...`, signatureSize);
    }
    issuerSignatureText = `${issuerSignatureText}...`;
  }

  const signatureY = lineCenterY - signatureWidth / 2;
  const signatureThickness = malvinasFont.heightAtSize(payerSignatureSize);
  const signatureLaneInset = 2;
  const signatureLaneLeft = signatureLineX + signatureLaneInset;
  const signatureLaneRight = signatureLabelLineX - signatureLaneInset;
  const signatureLaneWidth = signatureLaneRight - signatureLaneLeft;
  const signatureLeftX = signatureLaneLeft + (signatureLaneWidth - signatureThickness) / 2;
  const signatureTextX = signatureLeftX + signatureThickness;

  if (content.isAccepted) {
    page.drawText(signatureText, {
      x: signatureTextX - 3,
      y: signatureY,
      rotate: degrees(90),
      size: payerSignatureSize,
      font: malvinasFont,
      color: rgb(0, 0, 0.67),
    });
  }

  const signatureLabelSize = 6;
  const signatureLabelWidth = interSemiBoldFont.widthOfTextAtSize(labels.signatureOfAccepted, signatureLabelSize);
  const signatureLabelY = lineCenterY - signatureLabelWidth / 2;
  const signatureLabelThickness = interSemiBoldFont.heightAtSize(signatureLabelSize);
  const signatureLabelX = signatureLabelLineX + 4 + signatureLabelThickness;
  page.drawText(labels.signatureOfAccepted, {
    x: signatureLabelX,
    y: signatureLabelY,
    rotate: degrees(90),
    size: signatureLabelSize,
    font: interSemiBoldFont,
    color: textMuted,
  });

  const signatureLabelLeftX = signatureLabelX - signatureLabelThickness;
  const signatureLabelRightX = signatureLabelLeftX + signatureLabelThickness;
  const billInfoDividerX = signatureLabelRightX + 6;
  page.drawLine({
    start: { x: billInfoDividerX, y: lineStartY },
    end: { x: billInfoDividerX, y: lineEndY },
    thickness: 2,
    color: rgb(0xba / 255, 0xb4 / 255, 0xa9 / 255),
  });

  return {
    billInfoDividerX,
    signatureSize,
    signatureText,
    issuerSignatureText,
  };
}
