import { type ReactNode, useCallback } from "react";
import { DownloadIcon, XIcon } from "lucide-react";

import { useUiText } from "@/components/context/i18n/useUiText";
import { Heading } from "@/components/typography/Heading";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import type { UiMessages, UiT } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerScrollArea, DrawerTitle, DrawerTrigger } from "./ui/drawer";

type LegalNoticeProps = {
  mode?: "drawer" | "page";
  className?: string;
  hidePageHeading?: boolean;
  messages?: UiMessages;
  t?: UiT;
  content?: ReactNode;
  footer?: {
    version?: string;
    date?: string;
  };
  downloadPdf?: {
    fileName?: string;
    text?: string;
  };
  labels?: {
    trigger?: string;
    drawerTitle?: string;
    drawerDescription?: string;
    pageTitle?: string;
  };
};

const legalNoticeContentSections = [
  {
    headingKey: "ui.legalNotice.content.summary.heading" as const,
    legacyHeadingKey: "legalNotice.content.summary.heading",
    paragraphKeys: [{ key: "ui.legalNotice.content.summary.text" as const, legacyKey: "legalNotice.content.summary.text" }],
  },
  {
    headingKey: "ui.legalNotice.content.termsOfUse.heading" as const,
    legacyHeadingKey: "legalNotice.content.termsOfUse.heading",
    paragraphKeys: [
      { key: "ui.legalNotice.content.termsOfUse.paragraph1" as const, legacyKey: "legalNotice.content.termsOfUse.paragraph1" },
      { key: "ui.legalNotice.content.termsOfUse.paragraph2" as const, legacyKey: "legalNotice.content.termsOfUse.paragraph2" },
      { key: "ui.legalNotice.content.termsOfUse.paragraph3" as const, legacyKey: "legalNotice.content.termsOfUse.paragraph3" },
      { key: "ui.legalNotice.content.termsOfUse.paragraph4" as const, legacyKey: "legalNotice.content.termsOfUse.paragraph4" },
      { key: "ui.legalNotice.content.termsOfUse.paragraph5" as const, legacyKey: "legalNotice.content.termsOfUse.paragraph5" },
      { key: "ui.legalNotice.content.termsOfUse.paragraph6" as const, legacyKey: "legalNotice.content.termsOfUse.paragraph6" },
      { key: "ui.legalNotice.content.termsOfUse.paragraph7" as const, legacyKey: "legalNotice.content.termsOfUse.paragraph7" },
      { key: "ui.legalNotice.content.termsOfUse.paragraph8" as const, legacyKey: "legalNotice.content.termsOfUse.paragraph8" },
    ],
  },
];

function LegalNoticeContent({ messages, t }: { messages?: UiMessages; t?: UiT }) {
  const uiText = useUiText();
  return (
    <div className="mt-4 text-black dark:text-text-200 whitespace-pre-wrap break-words text-sm leading-5 font-normal [&_strong]:font-medium [&_strong]:text-text-300">
      {legalNoticeContentSections.map((section, sectionIndex) => (
        <div key={section.headingKey}>
          <p className={cn("mb-4 text-base leading-6 font-medium text-text-300", sectionIndex > 0)}>
            {uiText({
              key: section.headingKey,
              legacyKey: section.legacyHeadingKey,
              messages,
              t,
            })}
          </p>
          {section.paragraphKeys.map((paragraph, paragraphIndex) => (
            <p key={paragraph.key} className={cn(paragraphIndex > 0 && "mt-[14px]")}>
              {uiText({
                key: paragraph.key,
                legacyKey: paragraph.legacyKey,
                messages,
                t,
              })}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

function escapePdfText(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function normalizePdfText(value: string) {
  return value.replaceAll("—", "-").replaceAll("–", "-").replaceAll("´", "").replaceAll("’", "'").replaceAll("“", '"').replaceAll("”", '"');
}

type PdfLine = {
  text: string;
  font: "regular" | "bold";
  fontSize?: number;
};

function wrapPdfParagraph(paragraph: string, maxCharsPerLine = 88, font: PdfLine["font"] = "regular", fontSize?: number) {
  const words = normalizePdfText(paragraph).split(/\s+/).filter(Boolean);
  if (!words.length) return [{ text: "", font, fontSize }];

  const lines: PdfLine[] = [];
  let currentLine = words[0];

  for (const word of words.slice(1)) {
    const nextLine = `${currentLine} ${word}`;
    if (nextLine.length > maxCharsPerLine) {
      lines.push({ text: currentLine, font, fontSize });
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  }

  lines.push({ text: currentLine, font, fontSize });
  return lines;
}

function buildPdfLines(text: string) {
  const paragraphs = text.split(/\n\s*\n/);
  const lines: PdfLine[] = [];

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) {
      lines.push({ text: "", font: "regular" });
      continue;
    }

    if (/^Part\s+[IVXLC]+\s+-/i.test(trimmedParagraph)) {
      lines.push(...wrapPdfParagraph(trimmedParagraph, 88, "bold", 13));
      lines.push({ text: "", font: "regular" });
      continue;
    }

    if (trimmedParagraph.startsWith("§")) {
      const markerEnd = trimmedParagraph.indexOf(":");
      if (markerEnd !== -1) {
        const marker = trimmedParagraph.slice(0, markerEnd + 1);
        const rest = trimmedParagraph.slice(markerEnd + 1).trim();
        lines.push(...wrapPdfParagraph(marker, 88, "bold"));
        if (rest) {
          lines.push(...wrapPdfParagraph(rest, 88, "regular"));
        }
        lines.push({ text: "", font: "regular" });
        continue;
      }
    }

    lines.push(...wrapPdfParagraph(trimmedParagraph));
    lines.push({ text: "", font: "regular" });
  }

  if (lines.at(-1)?.text === "") {
    lines.pop();
  }

  return lines;
}

function encodePdfLatin1(value: string) {
  const normalized = normalizePdfText(value);
  const bytes = new Uint8Array(normalized.length);

  for (let index = 0; index < normalized.length; index += 1) {
    const code = normalized.charCodeAt(index);
    bytes[index] = code <= 255 ? code : 63;
  }

  return bytes;
}

function createPdfBlob({ title, text }: { title: string; text: string }) {
  const lines = buildPdfLines(text);

  const pageWidth = 595;
  const pageHeight = 842;
  const marginX = 48;
  const marginTop = 56;
  const marginBottom = 56;
  const lineHeight = 16;
  const maxLinesPerPage = Math.floor((pageHeight - marginTop - marginBottom) / lineHeight);
  const pages: PdfLine[][] = [];

  for (let index = 0; index < lines.length; index += maxLinesPerPage) {
    pages.push(lines.slice(index, index + maxLinesPerPage));
  }

  const objects: string[] = [];
  const addObject = (content: string) => {
    objects.push(content);
    return objects.length;
  };

  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const titleFontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const pageIds: number[] = [];

  const contentIds = pages.map((pageLines) => {
    const commands = ["BT"];
    let currentY = pageHeight - marginTop;

    if (pages.indexOf(pageLines) === 0) {
      commands.push(`/F2 16 Tf`, `1 0 0 1 ${marginX} ${currentY} Tm`, `(${escapePdfText(title)}) Tj`);
      currentY -= 28;
    }

    for (const line of pageLines) {
      commands.push(`/${line.font === "bold" ? "F2" : "F1"} ${line.fontSize ?? (line.font === "bold" ? 11 : 11)} Tf`);
      commands.push(`1 0 0 1 ${marginX} ${currentY} Tm`);
      commands.push(`(${escapePdfText(line.text)}) Tj`);
      currentY -= lineHeight;
    }
    commands.push("ET");

    const stream = commands.join("\n");
    return addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });

  const pagesRootId = objects.length + contentIds.length * 2 + 1;

  contentIds.forEach((contentId) => {
    const pageId = addObject(
      `<< /Type /Page /Parent ${pagesRootId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontId} 0 R /F2 ${titleFontId} 0 R >> >> /Contents ${contentId} 0 R >>`
    );
    pageIds.push(pageId);
  });

  const pagesObjectId = addObject(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`);
  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesObjectId} 0 R >>`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const offset of offsets.slice(1)) {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([encodePdfLatin1(pdf)], { type: "application/pdf" });
}

function buildDefaultPdfText({
  messages,
  t,
  uiText,
  footer,
}: {
  messages?: UiMessages;
  t?: UiT;
  uiText: ReturnType<typeof useUiText>;
  footer?: LegalNoticeProps["footer"];
}) {
  const blocks = legalNoticeContentSections.flatMap((section) => [
    uiText({ key: section.headingKey, legacyKey: section.legacyHeadingKey, messages, t }),
    ...section.paragraphKeys.map((paragraph) => uiText({ key: paragraph.key, legacyKey: paragraph.legacyKey, messages, t })),
  ]);

  if (footer?.version) {
    blocks.push(footer.version);
  }
  if (footer?.date) {
    blocks.push(footer.date);
  }

  return blocks.join("\n\n");
}

export function LegalNotice({
  mode = "drawer",
  className,
  hidePageHeading = false,
  messages,
  t,
  content,
  footer,
  downloadPdf,
  labels,
}: LegalNoticeProps) {
  const uiText = useUiText();
  const resolvedContent = content ?? <LegalNoticeContent messages={messages} t={t} />;
  const handleDownloadPdf = useCallback(() => {
    if (typeof window === "undefined") return;

    const title = labels?.drawerTitle ?? uiText({ key: "ui.legalNotice.review.title", legacyKey: "legalNotice.review.title", messages, t });
    const text = downloadPdf?.text ?? buildDefaultPdfText({ messages, t, uiText, footer });
    const fileName = downloadPdf?.fileName ?? "legal-notice.pdf";
    const pdfBlob = createPdfBlob({ title, text });
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 0);
  }, [downloadPdf?.fileName, downloadPdf?.text, footer, labels?.drawerTitle, messages, t, uiText]);

  if (mode === "page") {
    return (
      <LegalNoticePage
        className={className}
        hidePageHeading={hidePageHeading}
        messages={messages}
        t={t}
        content={resolvedContent}
        footer={footer}
        onDownloadPdf={handleDownloadPdf}
        labels={labels}
      />
    );
  } else {
    return (
      <Drawer>
        <DrawerTrigger className="!bg-transparent">
          <span className="text-brand-200 text-base font-medium -tracking-[0.32px]">
            {labels?.trigger ?? uiText({ key: "ui.legalNotice.review.trigger", legacyKey: "legalNotice.review.trigger", messages, t })}
          </span>
        </DrawerTrigger>
        <DrawerContent className="flex max-h-[88vh] flex-col gap-5 px-4 pb-4 max-w-[430px] bg-elevation-50 mx-auto pt-4">
          <DrawerDescription className="sr-only">
            {labels?.drawerDescription ??
              uiText({
                key: "ui.legalNotice.review.description",
                legacyKey: "legalNotice.review.description",
                messages,
                t,
              })}
          </DrawerDescription>
          <div className="grid grid-cols-[36px_1fr_36px] items-center gap-2 px-2">
            <DrawerClose asChild>
              <button
                type="button"
                aria-label={uiText({ key: "ui.drawer.actions.close", legacyKey: "drawer.actions.close", messages, t })}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-divider-75 bg-elevation-50 text-text-300"
              >
                <AppIcon icon={XIcon} className="h-4 w-4" />
              </button>
            </DrawerClose>
            <DrawerTitle className="text-text-300 text-base font-medium leading-normal text-center">
              {labels?.drawerTitle ?? uiText({ key: "ui.legalNotice.review.title", legacyKey: "legalNotice.review.title", messages, t })}
            </DrawerTitle>
            <button
              type="button"
              aria-label={uiText({
                key: "ui.legalNotice.actions.downloadPdf",
                legacyKey: "legalNotice.actions.downloadPdf",
                messages,
                t,
              })}
              onClick={handleDownloadPdf}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-divider-75 bg-elevation-50 text-text-300"
            >
              <AppIcon icon={DownloadIcon} className="h-4 w-4" />
            </button>
          </div>

          <DrawerScrollArea viewportClassName="max-h-[calc(88vh-10.5rem)] px-2 pb-10">
            <div className="flex flex-col gap-3">
              {resolvedContent}
              {footer?.version || footer?.date ? (
                <div className="pt-1 text-text-200 text-xs leading-[18px] font-medium">
                  {footer.version ? <p>{footer.version}</p> : null}
                  {footer.date ? <p>{footer.date}</p> : null}
                </div>
              ) : null}
            </div>
          </DrawerScrollArea>

          <DrawerClose asChild>
            <Button type="button" variant="outline" size="md" className="w-full">
              {uiText({ key: "ui.legalNotice.actions.close", legacyKey: "legalNotice.actions.close", messages, t })}
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    );
  }
}

function LegalNoticePage({
  className,
  hidePageHeading = false,
  messages,
  t,
  content,
  footer,
  onDownloadPdf,
  labels,
}: {
  className?: string;
  hidePageHeading?: boolean;
  messages?: UiMessages;
  t?: UiT;
  content: ReactNode;
  footer?: LegalNoticeProps["footer"];
  onDownloadPdf: () => void;
  labels?: LegalNoticeProps["labels"];
}) {
  const Container = hidePageHeading ? "div" : "section";
  const uiText = useUiText();

  return (
    <Container className={cn("mx-auto flex h-[calc(100vh-2rem)] min-h-0 w-full max-w-[430px] flex-col gap-6 rounded-2xl p-5", className)}>
      {!hidePageHeading ? (
        <div className="grid grid-cols-[36px_1fr_36px] items-center gap-2">
          <div aria-hidden="true" className="h-8 w-8" />
          <Heading as="h1" variant="sub" className="text-center">
            {labels?.pageTitle ?? uiText({ key: "ui.legalNotice.page.title", legacyKey: "legalNotice.page.title", messages, t })}
          </Heading>
          <button
            type="button"
            aria-label={uiText({
              key: "ui.legalNotice.actions.downloadPdf",
              legacyKey: "legalNotice.actions.downloadPdf",
              messages,
              t,
            })}
            onClick={onDownloadPdf}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-divider-75 bg-elevation-50 text-text-300"
          >
            <AppIcon icon={DownloadIcon} className="h-4 w-4" />
          </button>
        </div>
      ) : null}
      <DrawerScrollArea className="min-h-0 flex-1" viewportClassName="h-full min-h-0 pr-1 pb-10">
        <div className="flex flex-col gap-6">
          {content}
          {footer?.version || footer?.date ? (
            <div className="pt-1 text-text-200 text-xs leading-[18px] font-medium">
              {footer.version ? <p>{footer.version}</p> : null}
              {footer.date ? <p>{footer.date}</p> : null}
            </div>
          ) : null}
        </div>
      </DrawerScrollArea>
    </Container>
  );
}

export type { LegalNoticeProps };
