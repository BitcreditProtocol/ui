import { degrees, type PDFFont, type PDFPage, rgb } from "pdf-lib";

import { truncatePdfPlaceDateToFit, truncatePdfTextToFit } from "../utils/pdfTextTruncation";

import type { BackPageEndorsement } from "./backPageData";
import type { BackPageLabels } from "./backPageLabels";

const toTrimmedString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

type RenderBackPageEndorsementsArgs = {
  backPage: PDFPage;
  labels: BackPageLabels;
  endorsements: BackPageEndorsement[];
  panelIndex: number;
  margin: number;
  top: number;
  contentOffsetY: number;
  geistMonoFont: PDFFont;
  geistMonoRegularFont: PDFFont;
  geistMonoMediumFont: PDFFont;
  malvinasFont: PDFFont;
  lineColor: ReturnType<typeof rgb>;
  backTextColor: ReturnType<typeof rgb>;
  accent: ReturnType<typeof rgb>;
};

export function renderBackPageEndorsements({
  backPage,
  labels,
  endorsements,
  panelIndex,
  margin,
  top,
  contentOffsetY,
  geistMonoFont,
  geistMonoRegularFont,
  geistMonoMediumFont,
  malvinasFont,
  backTextColor,
  accent,
}: RenderBackPageEndorsementsArgs) {
  const endorsementsPerPage = 5;
  const panelEndorsements = endorsements.slice(panelIndex * endorsementsPerPage, (panelIndex + 1) * endorsementsPerPage);

  const columnTop = top - 28 + contentOffsetY;
  const columnBottom = margin + 24 + contentOffsetY;
  const columnHeight = columnTop - columnBottom;
  const signatureSize = 24;
  const backWidth = backPage.getSize().width;
  const contentRight = backWidth - margin;
  const endorsementStartX = margin + 120;
  const endorsementWidth = contentRight - endorsementStartX;
  const columnWidth = endorsementWidth / endorsementsPerPage;

  for (const [i, endorsement] of panelEndorsements.entries()) {
    const signerNameRaw = toTrimmedString(endorsement.signerName);
    const signatureNameRaw = toTrimmedString(endorsement.signatureName);
    const isBearerSigner = signerNameRaw.toLowerCase() === "bearer";
    if (isBearerSigner) {
      continue;
    }
    const columnShift = i * 12;
    const columnLeft = endorsementStartX + i * columnWidth;
    const labelX = columnLeft - 30 + columnShift;
    const nameX = columnLeft - 15 + columnShift;
    const addressLine1X = columnLeft - 1 + columnShift;
    const placeDividerX = columnLeft + 19 + columnShift;
    const signatureLineX = columnLeft + 86 + columnShift;
    const signatureLineInnerX = signatureLineX + 2;

    const labelSize = 8.5;
    const nameSize = 10;
    const addressSize = 8.5;
    const placeSize = 8.5;
    const signatureNameSize = 10;

    const endorsementLabelText = endorsement.label || labels.payToTheOrderOf;
    backPage.drawText(endorsementLabelText, {
      x: labelX,
      y: 39,
      rotate: degrees(90),
      size: labelSize,
      font: geistMonoRegularFont,
      color: backTextColor,
    });

    const textY = 39;

    const payeeName = truncatePdfTextToFit(geistMonoMediumFont, nameSize, endorsement.payeeName.toUpperCase(), columnHeight - 12);
    backPage.drawText(payeeName, {
      x: nameX + 4,
      y: textY,
      rotate: degrees(90),
      size: nameSize,
      font: geistMonoMediumFont,
      color: backTextColor,
    });

    const cleanedAddressLine1 = endorsement.payeeAddressLine1.trim();
    const cleanedAddressLine2 = endorsement.payeeAddressLine2.trim();
    const hasAddressLine1 = cleanedAddressLine1.length > 0 && cleanedAddressLine1 !== "-";
    const hasAddressLine2 = cleanedAddressLine2.length > 0 && cleanedAddressLine2 !== "-";
    let nextLaneX = addressLine1X;

    const addressLine1LaneX = nextLaneX;
    if (hasAddressLine1) {
      const payeeAddressLine1 = truncatePdfTextToFit(geistMonoRegularFont, addressSize, cleanedAddressLine1, columnHeight - 12);
      backPage.drawText(payeeAddressLine1, {
        x: addressLine1LaneX + 2,
        y: textY,
        rotate: degrees(90),
        size: addressSize,
        font: geistMonoFont,
        color: backTextColor,
      });
    }
    nextLaneX += 10;

    const addressLine2LaneX = nextLaneX;
    if (hasAddressLine2) {
      const payeeAddressLine2 = truncatePdfTextToFit(geistMonoRegularFont, addressSize, cleanedAddressLine2, columnHeight - 12);
      backPage.drawText(payeeAddressLine2, {
        x: addressLine2LaneX + 3,
        y: textY,
        rotate: degrees(90),
        size: addressSize,
        font: geistMonoFont,
        color: backTextColor,
      });
    }
    nextLaneX += 10;
    const placeDateX = nextLaneX + 18;

    const placeDateText = truncatePdfPlaceDateToFit(
      geistMonoRegularFont,
      placeSize,
      endorsement.signaturePlace,
      endorsement.signatureDate,
      columnHeight - 12
    );
    backPage.drawText(placeDateText, {
      x: placeDateX - 4,
      y: textY,
      rotate: degrees(90),
      size: placeSize,
      font: geistMonoFont,
      color: backTextColor,
    });

    backPage.drawLine({
      start: { x: placeDividerX, y: 39 },
      end: { x: placeDividerX, y: 39 + 181 },
      thickness: 1,
      color: rgb(0xd1 / 255, 0xcc / 255, 0xc1 / 255),
    });

    const lineStartY = 39;
    const lineEndY = 39 + 181;
    const lineCenterY = (lineStartY + lineEndY) / 2;
    const signatureText = truncatePdfTextToFit(malvinasFont, signatureSize, signatureNameRaw, columnHeight - 12);

    const signatureBody = signatureText.trim();
    const signatureLenY = malvinasFont.widthOfTextAtSize(signatureBody, signatureSize);
    const signatureY = lineCenterY - signatureLenY / 2;

    const signatureNameText = truncatePdfTextToFit(geistMonoMediumFont, signatureNameSize, signerNameRaw, columnHeight - 12);
    const signatureNameLenY = geistMonoMediumFont.widthOfTextAtSize(signatureNameText.toUpperCase(), signatureNameSize);
    const signatureNameY = lineCenterY - signatureNameLenY / 2;
    const signatureNameX = columnLeft + 48 + columnShift;
    const signatureX = columnLeft + 74 + columnShift;

    backPage.drawText(signatureNameText.toUpperCase(), {
      x: signatureNameX + 2,
      y: signatureNameY,
      rotate: degrees(90),
      size: signatureNameSize,
      font: geistMonoMediumFont,
      color: accent,
    });

    backPage.drawText(signatureText, {
      x: signatureX,
      y: signatureY,
      rotate: degrees(90),
      size: signatureSize,
      font: malvinasFont,
      color: accent,
    });

    backPage.drawLine({
      start: { x: signatureLineX - 2, y: 39 },
      end: { x: signatureLineX - 2, y: 39 + 181 },
      thickness: 1,
      color: rgb(0xa3 / 255, 0x9d / 255, 0x91 / 255),
    });
    backPage.drawLine({
      start: { x: signatureLineInnerX - 2, y: 39 },
      end: { x: signatureLineInnerX - 2, y: 39 + 181 },
      thickness: 1,
      color: rgb(0xa3 / 255, 0x9d / 255, 0x91 / 255),
    });
  }
}
