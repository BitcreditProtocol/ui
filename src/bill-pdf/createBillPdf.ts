import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";

import bitcoinLogoPng from "./assets/bitcoin_logo_billprint.png";
import geistMonoMedium from "./assets/GeistMono-Medium.ttf";
import geistMonoRegular from "./assets/GeistMono-Regular.ttf";
import interSemiBold from "./assets/Inter-SemiBold.ttf";
import interRegular from "./assets/Inter-VariableFont.ttf";
import malvinasSignature from "./assets/Malvinas-Signature-Regular.otf";
import morionBetaRegular from "./assets/Morion-Beta-Regular.ttf";
import { renderBackPage } from "./backPage";
import type { BillPdfEndorsement } from "./backPage/backPageData";
import { renderFrontPage } from "./frontPage";
import type { BillPdfContent } from "./frontPage/billPdfData";
import { type BillPdfLabels, DEFAULT_BILL_PDF_LABELS } from "./frontPage/billPdfLabels";
import { BILL_PDF_PANEL_PADDING, BILL_PDF_PANEL_SIZE, BILL_PDF_SHEET_SIZE } from "./utils/billPdfLayout";

export const DEFAULT_BILL_PDF_FOOTER = "Physical copy of electronic bill of exchange. Not the original.";

export type CreateBillPdfOptions = {
  labels?: BillPdfLabels;
  footerText?: string;
};

export async function createBillPdf(
  content: BillPdfContent,
  endorsements: BillPdfEndorsement[] = [],
  { labels = DEFAULT_BILL_PDF_LABELS, footerText = DEFAULT_BILL_PDF_FOOTER }: CreateBillPdfOptions = {}
): Promise<Uint8Array> {
  const fetchAssetBytes = async (assetUrl: string) => {
    const response = await fetch(assetUrl);
    return response.arrayBuffer();
  };

  const endorsementData = endorsements;
  const endorsementCount = endorsementData.length;
  const endorsementPanels = Math.max(1, Math.ceil(endorsementCount / 5));
  const totalPanels = 1 + endorsementPanels;

  const panelDoc = await PDFDocument.create();
  panelDoc.registerFontkit(fontkit);
  const morionBytes = await fetchAssetBytes(morionBetaRegular);
  const morionFont = await panelDoc.embedFont(morionBytes);
  const interBytes = await fetchAssetBytes(interRegular);
  const interFont = await panelDoc.embedFont(interBytes);
  const interSemiBoldBytes = await fetchAssetBytes(interSemiBold);
  const interSemiBoldFont = await panelDoc.embedFont(interSemiBoldBytes);
  const geistMonoBytes = await fetchAssetBytes(geistMonoRegular);
  const geistMonoFont = await panelDoc.embedFont(geistMonoBytes);
  const geistMonoMediumBytes = await fetchAssetBytes(geistMonoMedium);
  const geistMonoMediumFont = await panelDoc.embedFont(geistMonoMediumBytes);
  const geistMonoRegularFont = geistMonoFont;
  const malvinasBytes = await fetchAssetBytes(malvinasSignature);
  const malvinasFont = await panelDoc.embedFont(malvinasBytes);
  const logoBytes = await fetchAssetBytes(bitcoinLogoPng);
  const logoImage = await panelDoc.embedPng(logoBytes);

  renderFrontPage(
    panelDoc,
    content,
    labels,
    logoImage,
    morionFont,
    interFont,
    interSemiBoldFont,
    geistMonoFont,
    geistMonoMediumFont,
    geistMonoRegularFont,
    malvinasFont,
    1,
    totalPanels
  );
  for (let i = 0; i < endorsementPanels; i += 1) {
    renderBackPage(
      panelDoc,
      labels,
      endorsementData,
      i,
      i + 2,
      totalPanels,
      geistMonoFont,
      geistMonoRegularFont,
      geistMonoMediumFont,
      malvinasFont,
      morionFont
    );
  }

  const panelPageCount = panelDoc.getPageCount();
  const panelBytes = await panelDoc.save();
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const embeddedPanels = await pdfDoc.embedPdf(
    panelBytes,
    Array.from({ length: panelPageCount }, (_, index) => index)
  );

  const sheetWidth = BILL_PDF_SHEET_SIZE.width;
  const sheetHeight = BILL_PDF_SHEET_SIZE.height;
  const panelWidth = BILL_PDF_PANEL_SIZE.width;
  const panelHeight = BILL_PDF_PANEL_SIZE.height;
  const panelSlotHeight = panelHeight + BILL_PDF_PANEL_PADDING * 2;
  const footerFont = await pdfDoc.embedFont(geistMonoBytes);
  const footerSize = 8;
  const footerWidth = footerFont.widthOfTextAtSize(footerText, footerSize);
  const footerY = 5;

  for (let i = 0; i < embeddedPanels.length; i += 2) {
    const sheet = pdfDoc.addPage([sheetWidth, sheetHeight]);
    const topPanel = embeddedPanels[i];
    const bottomPanel = i + 1 < embeddedPanels.length ? embeddedPanels[i + 1] : undefined;

    const topPanelY = sheetHeight - panelSlotHeight;
    sheet.drawRectangle({
      x: BILL_PDF_PANEL_PADDING,
      y: topPanelY + BILL_PDF_PANEL_PADDING,
      width: panelWidth,
      height: panelHeight,
      color: rgb(0xf6 / 255, 0xf2 / 255, 0xe7 / 255),
    });
    sheet.drawPage(topPanel, {
      x: BILL_PDF_PANEL_PADDING,
      y: topPanelY + BILL_PDF_PANEL_PADDING,
    });

    if (bottomPanel) {
      sheet.drawRectangle({
        x: BILL_PDF_PANEL_PADDING,
        y: BILL_PDF_PANEL_PADDING,
        width: panelWidth,
        height: panelHeight,
        color: rgb(0xf6 / 255, 0xf2 / 255, 0xe7 / 255),
      });
      sheet.drawPage(bottomPanel, {
        x: BILL_PDF_PANEL_PADDING,
        y: BILL_PDF_PANEL_PADDING,
      });
    }

    sheet.drawText(footerText, {
      x: (sheetWidth - footerWidth) / 2,
      y: footerY + 19,
      size: footerSize,
      font: footerFont,
      color: rgb(0x8d / 255, 0x85 / 255, 0x79 / 255),
    });
  }

  return pdfDoc.save();
}
