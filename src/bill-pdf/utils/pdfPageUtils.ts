import { type PDFFont, type rgb } from "pdf-lib";

export function drawPageNumber(
  page: { drawText: (text: string, options: Record<string, unknown>) => void },
  value: string,
  x: number,
  y: number,
  font: PDFFont,
  color: ReturnType<typeof rgb>,
  options?: {
    size?: number;
    align?: "left" | "right";
  }
) {
  const size = options?.size ?? 8;
  const alignedX = options?.align === "right" ? x - font.widthOfTextAtSize(value, size) : x;
  page.drawText(value, {
    x: alignedX,
    y,
    size,
    font,
    color,
  });
}
