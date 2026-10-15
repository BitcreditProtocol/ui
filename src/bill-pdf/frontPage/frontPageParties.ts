import { type PDFFont, type PDFPage, rgb } from "pdf-lib";

import type { BillPdfContent } from "./billPdfData";
import type { FrontPageLabels } from "./billPdfLabels";

type RenderFrontPagePartiesArgs = {
  page: PDFPage;
  billInfoLeft: number;
  contentRight: number;
  top: number;
  labels: FrontPageLabels;
  content: BillPdfContent;
  issuerSignatureText: string;
  signatureSize: number;
  interSemiBoldFont: PDFFont;
  geistMonoFont: PDFFont;
  geistMonoMediumFont: PDFFont;
  geistMonoRegularFont: PDFFont;
  malvinasFont: PDFFont;
  lineColor: ReturnType<typeof rgb>;
  textMuted: ReturnType<typeof rgb>;
  acceptedAccent: ReturnType<typeof rgb>;
};

export function renderFrontPageParties({
  page,
  billInfoLeft,
  labels,
  content,
  issuerSignatureText,
  signatureSize,
  interSemiBoldFont,
  geistMonoMediumFont,
  geistMonoRegularFont,
  malvinasFont,
  textMuted,
  acceptedAccent,
}: RenderFrontPagePartiesArgs) {
  const truncateToWidth = (text: string, font: PDFFont, size: number, maxWidth: number) => {
    let output = text;
    let width = font.widthOfTextAtSize(output, size);
    if (width <= maxWidth) {
      return output;
    }
    while (output.length > 1 && width > maxWidth - 10) {
      output = output.slice(0, -1);
      width = font.widthOfTextAtSize(`${output}...`, size);
    }
    return `${output}...`;
  };
  const truncateLeadingSegmentToWidth = (text: string, font: PDFFont, size: number, maxWidth: number) => {
    const normalized = text.trim();
    if (!normalized || font.widthOfTextAtSize(normalized, size) <= maxWidth) {
      return normalized;
    }

    const parts = normalized
      .split(", ")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length <= 1) {
      return truncateToWidth(normalized, font, size, maxWidth);
    }

    const trailingText = parts.slice(1).join(", ");
    const separator = ", ";
    const reservedWidth = font.widthOfTextAtSize(`${separator}${trailingText}`, size);

    if (reservedWidth >= maxWidth) {
      return truncateToWidth(trailingText, font, size, maxWidth);
    }

    const leadingText = truncateToWidth(parts[0] ?? "", font, size, maxWidth - reservedWidth);

    return `${leadingText}${separator}${trailingText}`;
  };
  const splitToTwoLines = (text: string, font: PDFFont, size: number, maxWidth: number) => {
    const normalized = text.trim();
    if (!normalized) {
      return { line1: "", line2: "" };
    }
    if (font.widthOfTextAtSize(normalized, size) <= maxWidth) {
      return { line1: normalized, line2: "" };
    }
    const words = normalized.split(/\s+/);
    let line1 = "";
    let idx = 0;
    while (idx < words.length) {
      const candidate = line1 ? `${line1} ${words[idx]}` : words[idx];
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line1 = candidate;
        idx += 1;
      } else {
        break;
      }
    }
    if (!line1) {
      let first = normalized;
      while (first.length > 1 && font.widthOfTextAtSize(first, size) > maxWidth) {
        first = first.slice(0, -1);
      }
      const rest = normalized.slice(first.length).trimStart();
      return {
        line1: first,
        line2: truncateToWidth(rest, font, size, maxWidth),
      };
    }
    return {
      line1,
      line2: truncateToWidth(words.slice(idx).join(" "), font, size, maxWidth),
    };
  };
  const toStringOr = (value: unknown, fallback: string): string => {
    if (typeof value === "string") {
      return value;
    }
    return fallback;
  };
  const payerLaneWidth = 267;
  const payerNameText = truncateToWidth(content.payerName.toUpperCase(), geistMonoMediumFont, 10, payerLaneWidth);

  page.drawText(labels.payer, {
    x: billInfoLeft,
    y: 108,
    size: 8,
    font: interSemiBoldFont,
    color: textMuted,
  });

  page.drawText(payerNameText, {
    x: billInfoLeft,
    y: 88,
    size: 10,
    font: geistMonoMediumFont,
    color: acceptedAccent,
  });

  const payerDividerTopY = 53;
  const payerAddressBottomGap = 9.5;
  const payerAddressLineHeight = 8.5 * 1.4;
  const payerAddressLine2Y = payerDividerTopY + payerAddressBottomGap;
  const payerAddressLine1Y = payerAddressLine2Y + payerAddressLineHeight;
  const payerAddressLine1Text = truncateToWidth(content.payerAddressLine1, geistMonoRegularFont, 8.5, payerLaneWidth);

  page.drawText(payerAddressLine1Text, {
    x: billInfoLeft,
    y: payerAddressLine1Y,
    size: 8.5,
    font: geistMonoRegularFont,
    color: acceptedAccent,
  });

  if (content.payerAddressLine2) {
    const payerAddressLine2Text = truncateLeadingSegmentToWidth(content.payerAddressLine2, geistMonoRegularFont, 8.5, payerLaneWidth);
    page.drawText(payerAddressLine2Text, {
      x: billInfoLeft,
      y: payerAddressLine2Y,
      size: 8.5,
      font: geistMonoRegularFont,
      color: acceptedAccent,
    });
  }

  page.drawLine({
    start: { x: billInfoLeft, y: 53 },
    end: { x: billInfoLeft + 267, y: 53 },
    thickness: 1,
    color: rgb(0xa3 / 255, 0x9d / 255, 0x91 / 255),
  });
  page.drawLine({
    start: { x: billInfoLeft, y: 51 },
    end: { x: billInfoLeft + 267, y: 51 },
    thickness: 1,
    color: rgb(0xa3 / 255, 0x9d / 255, 0x91 / 255),
  });

  const paymentFlow = {
    x: billInfoLeft,
    width: 267,
    gap: 6,
  };
  const paymentAddressSize = 8.5;
  const paymentAddressBottomOffset = 14;
  const paymentAddressLineGap = 2;
  const paymentAddressLineHeight = geistMonoRegularFont.heightAtSize(paymentAddressSize, {
    descender: true,
  });
  const paymentAddressDescender = paymentAddressLineHeight - geistMonoRegularFont.heightAtSize(paymentAddressSize, { descender: false });
  const paymentAddressLine2Y = paymentAddressBottomOffset + paymentAddressDescender;
  const paymentAddressLine1Y = paymentAddressLine2Y + paymentAddressLineHeight + paymentAddressLineGap;
  const paymentAddressBox = {
    x: paymentFlow.x,
    y: paymentAddressBottomOffset,
    width: paymentFlow.width,
    height: paymentAddressLineHeight * 2 + paymentAddressLineGap,
  };
  const paymentInstructionsSize = 6;
  const paymentAddressRaw = toStringOr(content.paymentAddress, "");
  const { line1: paymentAddressLine1, line2: paymentAddressLine2 } = splitToTwoLines(
    paymentAddressRaw,
    geistMonoRegularFont,
    paymentAddressSize,
    paymentAddressBox.width
  );
  const isTwoLinePaymentAddress = Boolean(paymentAddressLine2);
  const singleLineY = paymentAddressLine1Y;
  const displayedAddressY = isTwoLinePaymentAddress ? paymentAddressLine1Y : singleLineY;
  const paymentInstructionsY = displayedAddressY + 6;
  const paymentInstructionsLabel = toStringOr(labels.paymentInstructions, "Payment instruction:");

  page.drawText(paymentInstructionsLabel, {
    x: paymentFlow.x,
    y: paymentInstructionsY + 3,
    size: paymentInstructionsSize,
    font: interSemiBoldFont,
    color: textMuted,
  });

  if (content.isPaymentRequested) {
    page.drawText(paymentAddressLine1, {
      x: paymentAddressBox.x,
      y: (isTwoLinePaymentAddress ? paymentAddressLine1Y : singleLineY) - 6,
      size: paymentAddressSize,
      font: geistMonoRegularFont,
      color: rgb(0, 0, 0.67),
    });
    if (isTwoLinePaymentAddress) {
      page.drawText(paymentAddressLine2, {
        x: paymentAddressBox.x,
        y: paymentAddressLine2Y,
        size: paymentAddressSize,
        font: geistMonoRegularFont,
        color: rgb(0, 0, 0.67),
      });
    }
  }

  // issuer
  const issuerX = billInfoLeft + 287;
  page.drawText(labels.issuer, {
    x: issuerX,
    y: 108,
    size: 8,
    font: interSemiBoldFont,
    color: textMuted,
  });

  const issuerLaneWidth = 267;
  const issuerNameText = truncateToWidth(content.issuerName.toUpperCase(), geistMonoMediumFont, 10, issuerLaneWidth);
  const issuerNameWidth = geistMonoMediumFont.widthOfTextAtSize(issuerNameText, 10);
  const issuerNameX = issuerX + (issuerLaneWidth - issuerNameWidth) / 2;
  page.drawText(issuerNameText, {
    x: issuerNameX,
    y: 88,
    size: 10,
    font: geistMonoMediumFont,
    color: acceptedAccent,
  });

  const issuerAddressLine1Text = truncateToWidth(content.issuerAddressLine1, geistMonoRegularFont, 8.5, issuerLaneWidth);
  const issuerAddressLine1Width = geistMonoRegularFont.widthOfTextAtSize(issuerAddressLine1Text, 8.5);
  const issuerAddressLine1X = issuerX + (issuerLaneWidth - issuerAddressLine1Width) / 2;
  page.drawText(issuerAddressLine1Text, {
    x: issuerAddressLine1X,
    y: payerAddressLine1Y,
    size: 8.5,
    font: geistMonoRegularFont,
    color: acceptedAccent,
  });
  if (content.issuerAddressLine2) {
    const issuerAddressLine2Text = truncateLeadingSegmentToWidth(content.issuerAddressLine2, geistMonoRegularFont, 8.5, issuerLaneWidth);
    const issuerAddressLine2Width = geistMonoRegularFont.widthOfTextAtSize(issuerAddressLine2Text, 8.5);
    const issuerAddressLine2X = issuerX + (issuerLaneWidth - issuerAddressLine2Width) / 2;
    page.drawText(issuerAddressLine2Text, {
      x: issuerAddressLine2X,
      y: payerAddressLine2Y,
      size: 8.5,
      font: geistMonoRegularFont,
      color: acceptedAccent,
    });
  }

  page.drawLine({
    start: { x: issuerX, y: 53 },
    end: { x: issuerX + 267, y: 53 },
    thickness: 1,
    color: rgb(0xa3 / 255, 0x9d / 255, 0x91 / 255),
  });
  page.drawLine({
    start: { x: issuerX, y: 51 },
    end: { x: issuerX + 267, y: 51 },
    thickness: 1,
    color: rgb(0xa3 / 255, 0x9d / 255, 0x91 / 255),
  });

  page.drawText(labels.signatures, {
    x: issuerX,
    y: 38,
    size: 6,
    font: interSemiBoldFont,
    color: textMuted,
  });

  let truncatedIssuerSignature = issuerSignatureText;
  const maxSignatureWidth = 267;
  let issuerSigWidth = malvinasFont.widthOfTextAtSize(truncatedIssuerSignature, signatureSize);

  if (issuerSigWidth > maxSignatureWidth) {
    while (issuerSigWidth > maxSignatureWidth - 20 && truncatedIssuerSignature.length > 1) {
      truncatedIssuerSignature = truncatedIssuerSignature.slice(0, -1);
      issuerSigWidth = malvinasFont.widthOfTextAtSize(`${truncatedIssuerSignature}...`, signatureSize);
    }
    truncatedIssuerSignature = `${truncatedIssuerSignature}...`;
  }
  const issuerSignatureX = issuerX + (maxSignatureWidth - issuerSigWidth) / 2;

  page.drawText(truncatedIssuerSignature, {
    x: issuerSignatureX,
    y: 8,
    size: signatureSize,
    font: malvinasFont,
    color: rgb(0, 0, 0.67),
  });
}
