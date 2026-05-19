import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { useUiText } from "@/components/context/i18n/useUiText";
import { Heading } from "@/components/typography/Heading";
import type { UiMessages, UiT } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";

import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "./ui/drawer";

type TermsAndConditionsProps = {
  mode?: "drawer" | "page";
  className?: string;
  hidePageHeading?: boolean;
  messages?: UiMessages;
  t?: UiT;
  content?: ReactNode;
  labels?: {
    trigger?: string;
    drawerTitle?: string;
    drawerDescription?: string;
    pageTitle?: string;
  };
};

function TermsContent({ messages, t }: { messages?: UiMessages; t?: UiT }) {
  const uiText = useUiText();
  return (
    <div className="text-text-200 text-xs font-sans font-normal leading-normal whitespace-pre-wrap break-words">
      <p className="font-medium mb-2">
        {uiText({ key: "ui.termsAndConditions.content.title", legacyKey: "termsAndConditions.content.title", messages, t })}
      </p>

      <p className="mt-4 mb-2">
        {uiText({
          key: "ui.termsAndConditions.content.summary.heading",
          legacyKey: "termsAndConditions.content.summary.heading",
          messages,
          t,
        })}
      </p>
      <p>
        {uiText({ key: "ui.termsAndConditions.content.summary.text", legacyKey: "termsAndConditions.content.summary.text", messages, t })}
      </p>

      <p className="mt-4 mb-2">
        {uiText({
          key: "ui.termsAndConditions.content.termsOfUse.heading",
          legacyKey: "termsAndConditions.content.termsOfUse.heading",
          messages,
          t,
        })}
      </p>
      <p>
        {uiText({
          key: "ui.termsAndConditions.content.termsOfUse.paragraph1",
          legacyKey: "termsAndConditions.content.termsOfUse.paragraph1",
          messages,
          t,
        })}
      </p>
      <p className="mt-2">
        {uiText({
          key: "ui.termsAndConditions.content.termsOfUse.paragraph2",
          legacyKey: "termsAndConditions.content.termsOfUse.paragraph2",
          messages,
          t,
        })}
      </p>
      <p className="mt-2">
        {uiText({
          key: "ui.termsAndConditions.content.termsOfUse.paragraph3",
          legacyKey: "termsAndConditions.content.termsOfUse.paragraph3",
          messages,
          t,
        })}
      </p>
      <p className="mt-2">
        {uiText({
          key: "ui.termsAndConditions.content.termsOfUse.paragraph4",
          legacyKey: "termsAndConditions.content.termsOfUse.paragraph4",
          messages,
          t,
        })}
      </p>
      <p className="mt-2">
        {uiText({
          key: "ui.termsAndConditions.content.termsOfUse.paragraph5",
          legacyKey: "termsAndConditions.content.termsOfUse.paragraph5",
          messages,
          t,
        })}
      </p>
      <p className="mt-2">
        {uiText({
          key: "ui.termsAndConditions.content.termsOfUse.paragraph6",
          legacyKey: "termsAndConditions.content.termsOfUse.paragraph6",
          messages,
          t,
        })}
      </p>
      <p className="mt-2">
        {uiText({
          key: "ui.termsAndConditions.content.termsOfUse.paragraph7",
          legacyKey: "termsAndConditions.content.termsOfUse.paragraph7",
          messages,
          t,
        })}
      </p>
      <p className="mt-2">
        {uiText({
          key: "ui.termsAndConditions.content.termsOfUse.paragraph8",
          legacyKey: "termsAndConditions.content.termsOfUse.paragraph8",
          messages,
          t,
        })}
      </p>
    </div>
  );
}

export function TermsAndConditions({
  mode = "drawer",
  className,
  hidePageHeading = false,
  messages,
  t,
  content,
  labels,
}: TermsAndConditionsProps) {
  const uiText = useUiText();
  const resolvedContent = content ?? <TermsContent messages={messages} t={t} />;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const updateBottomFade = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) {
      setShowBottomFade(false);
      return;
    }

    const hasOverflow = el.scrollHeight - el.clientHeight > 1;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    setShowBottomFade(hasOverflow && !isAtBottom);
  }, []);

  useEffect(() => {
    updateBottomFade();

    const el = scrollContainerRef.current;
    if (!el) return;

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateBottomFade);
      return () => {
        window.removeEventListener("resize", updateBottomFade);
      };
    }

    const resizeObserver = new ResizeObserver(() => {
      updateBottomFade();
    });

    resizeObserver.observe(el);
    if (el.firstElementChild) {
      resizeObserver.observe(el.firstElementChild);
    }

    window.addEventListener("resize", updateBottomFade);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateBottomFade);
    };
  }, [resolvedContent, updateBottomFade]);

  if (mode === "page") {
    return (
      <TermsAndConditionsPage
        className={className}
        hidePageHeading={hidePageHeading}
        messages={messages}
        t={t}
        content={resolvedContent}
        labels={labels}
      />
    );
  } else {
    return (
      <Drawer>
        <DrawerTrigger className="!bg-transparent">
          <span className="text-brand-200 text-base font-medium -tracking-[0.32px]">
            {labels?.trigger ??
              uiText({ key: "ui.termsAndConditions.review.terms", legacyKey: "termsAndConditions.review.terms", messages, t })}
          </span>
        </DrawerTrigger>
        <DrawerContent className="flex max-h-[80vh] flex-col gap-6 pb-8 px-5 max-w-[430px] bg-elevation-50 mx-auto">
          <DrawerTitle className="text-text-300 text-base font-medium leading-normal text-center">
            {labels?.drawerTitle ??
              uiText({ key: "ui.termsAndConditions.review.title", legacyKey: "termsAndConditions.review.title", messages, t })}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            {labels?.drawerDescription ??
              uiText({
                key: "ui.termsAndConditions.review.description",
                legacyKey: "termsAndConditions.review.description",
                messages,
                t,
              })}
          </DrawerDescription>

          <div className="relative">
            <div ref={scrollContainerRef} onScroll={updateBottomFade} className="max-h-[calc(80vh-9rem)] overflow-y-auto pr-1">
              {resolvedContent}
            </div>
            {showBottomFade ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-elevation-50 to-transparent dark:from-elevation-250"
              />
            ) : null}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
}

function TermsAndConditionsPage({
  className,
  hidePageHeading = false,
  messages,
  t,
  content,
  labels,
}: {
  className?: string;
  hidePageHeading?: boolean;
  messages?: UiMessages;
  t?: UiT;
  content: ReactNode;
  labels?: TermsAndConditionsProps["labels"];
}) {
  const Container = hidePageHeading ? "div" : "section";
  const uiText = useUiText();

  return (
    <Container className={cn("mx-auto flex w-full max-w-[430px] flex-col gap-6 rounded-2xl p-5", className)}>
      {!hidePageHeading ? (
        <Heading as="h1" variant="sub">
          {labels?.pageTitle ??
            uiText({ key: "ui.termsAndConditions.page.title", legacyKey: "termsAndConditions.page.title", messages, t })}
        </Heading>
      ) : null}
      <div className="flex flex-col gap-6">{content}</div>
    </Container>
  );
}
