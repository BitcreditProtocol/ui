import { type PDFFont } from "pdf-lib";

export const truncatePdfTextToFit = (font: PDFFont, size: number, text: string, maxWidth: number) => {
  if (!text) {
    return "";
  }

  let output = text;
  let width = font.widthOfTextAtSize(output, size);
  if (width <= maxWidth) {
    return output;
  }

  while (width > maxWidth - 6 && output.length > 1) {
    output = output.slice(0, -1);
    width = font.widthOfTextAtSize(`${output}...`, size);
  }

  return `${output}...`;
};

export const truncatePdfLeadingSegmentToFit = (font: PDFFont, size: number, text: string, maxWidth: number, trailingSegmentCount = 2) => {
  if (!text || font.widthOfTextAtSize(text, size) <= maxWidth) {
    return text;
  }

  const parts = text
    .split(", ")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length <= 1) {
    return truncatePdfTextToFit(font, size, text, maxWidth);
  }

  const safeTrailingSegmentCount = Math.min(Math.max(1, trailingSegmentCount), parts.length - 1);
  const trailingParts = parts.slice(-safeTrailingSegmentCount);
  const leadingParts = parts.slice(0, Math.max(1, parts.length - trailingParts.length));
  const trailingText = trailingParts.join(", ");
  const separator = ", ";
  const reservedTrailingWidth = font.widthOfTextAtSize(`${separator}${trailingText}`, size);

  if (reservedTrailingWidth >= maxWidth) {
    return truncatePdfTextToFit(font, size, trailingText, maxWidth);
  }

  const availableLeadingWidth = maxWidth - reservedTrailingWidth;
  const leadingText = truncatePdfTextToFit(font, size, leadingParts.join(", "), availableLeadingWidth);

  return `${leadingText}${separator}${trailingText}`;
};

export const truncatePdfPlaceDateToFit = (font: PDFFont, size: number, place: string, date: string, maxWidth: number) => {
  const trimmedPlace = place.trim();
  const trimmedDate = date.trim();

  if (!trimmedPlace) {
    return truncatePdfTextToFit(font, size, trimmedDate, maxWidth);
  }

  if (!trimmedDate) {
    return truncatePdfTextToFit(font, size, trimmedPlace, maxWidth);
  }

  const fullText = `${trimmedPlace}, ${trimmedDate}`;
  if (font.widthOfTextAtSize(fullText, size) <= maxWidth) {
    return fullText;
  }

  const dateWidth = font.widthOfTextAtSize(trimmedDate, size);
  const separator = ", ";
  const separatorWidth = font.widthOfTextAtSize(separator, size);
  const remainingWidth = maxWidth - dateWidth - separatorWidth;

  if (remainingWidth <= 0) {
    return truncatePdfTextToFit(font, size, trimmedDate, maxWidth);
  }

  return `${truncatePdfTextToFit(font, size, trimmedPlace, remainingWidth)}${separator}${trimmedDate}`;
};
