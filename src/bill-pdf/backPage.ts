import { degrees, type PDFDocument, type PDFFont, rgb } from "pdf-lib";

import type { BackPageEndorsement } from "./backPage/backPageData";
import { renderBackPageEndorsements } from "./backPage/backPageEndorsements";
import type { BillPdfLabels } from "./frontPage/billPdfLabels";
import { BILL_PDF_PANEL_SIZE } from "./utils/billPdfLayout";
import { drawPageNumber } from "./utils/pdfPageUtils";

export function renderBackPage(
  pdfDoc: PDFDocument,
  labels: BillPdfLabels,
  endorsements: BackPageEndorsement[],
  panelIndex: number,
  pageNumber: number,
  totalPages: number,
  geistMonoFont: PDFFont,
  geistMonoRegularFont: PDFFont,
  geistMonoMediumFont: PDFFont,
  malvinasFont: PDFFont,
  morionFont: PDFFont
) {
  const backPage = pdfDoc.addPage([BILL_PDF_PANEL_SIZE.width, BILL_PDF_PANEL_SIZE.height]);

  const margin = 16;
  const backWidth = backPage.getSize().width;
  const backHeight = backPage.getSize().height;
  const contentRight = backWidth;
  const top = backHeight - margin;
  const contentOffsetY = 24;

  const backgroundColor = rgb(0xfe / 255, 0xfb / 255, 0xf1 / 255);
  const lineColor = rgb(0.85, 0.84, 0.82);
  const textMuted = rgb(0.55, 0.52, 0.47);
  const endorsementsColor = rgb(0x1b / 255, 0x0f / 255, 0x00 / 255);
  const backTextColor = endorsementsColor;
  const accent = rgb(0, 0, 0.67);

  backPage.drawRectangle({
    x: 0,
    y: 0,
    width: backWidth,
    height: backHeight,
    color: backgroundColor,
  });

  const backLabel = pageNumber >= 3 ? `Rider ${String(pageNumber - 2)}` : labels.back;
  const backLabelSize = 8;
  backPage.drawText(backLabel, {
    x: 5,
    y: top + 3,
    size: backLabelSize,
    font: geistMonoRegularFont,
    color: textMuted,
  });

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
      backPage.drawText(glyph, {
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
  const measureTrackedWidth = (text: string, font: PDFFont, size: number, tracking: number) => {
    if (text.length === 0) {
      return 0;
    }
    return font.widthOfTextAtSize(text, size) + tracking * (text.length - 1);
  };

  const endorsementsLabel = labels.endorsements.toUpperCase();
  const endorsementsSize = 18;
  const endorsementsTracking = endorsementsSize * 0.03;
  const endorsementsTrackedWidth = measureTrackedWidth(endorsementsLabel, morionFont, endorsementsSize, endorsementsTracking);
  const endorsementsTopInset = 46;
  const endorsementsBottomInset = 46;
  const endorsementsTitleLeft = 45;
  const endorsementsBandBottomY = endorsementsBottomInset;
  const endorsementsBandHeight = backHeight - endorsementsTopInset - endorsementsBottomInset;
  const endorsementsY = endorsementsBandBottomY + (endorsementsBandHeight - endorsementsTrackedWidth) / 2;
  const endorsementsThickness = morionFont.heightAtSize(endorsementsSize);
  const endorsementsX = endorsementsTitleLeft + endorsementsThickness;
  drawTrackedRotatedText({
    text: endorsementsLabel,
    x: endorsementsX - 3,
    y: endorsementsY,
    size: endorsementsSize,
    font: morionFont,
    color: endorsementsColor,
    tracking: endorsementsTracking,
  });

  renderBackPageEndorsements({
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
    lineColor,
    backTextColor,
    accent,
  });

  drawPageNumber(
    backPage,
    labels.pageNumber({ current: pageNumber, total: totalPages }),
    contentRight - 5,
    5,
    geistMonoRegularFont,
    textMuted,
    { size: 8, align: "right" }
  );
}
