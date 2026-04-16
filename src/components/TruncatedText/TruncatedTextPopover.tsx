import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { extractTextFromNode, getTruncatedTextState } from "@/components/TruncatedText/truncated-text.ts";
import { cn } from "@/lib/utils";

type TruncatedTextPopoverProps = {
  text: React.ReactNode;
  maxLength?: number;
  className?: string;
  contentClassName?: string;
  title?: string;
  as?: "button" | "span";
};

export function TruncatedTextPopover({ text, maxLength, className, contentClassName, title, as = "span" }: TruncatedTextPopoverProps) {
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const [hasWidthOverflow, setHasWidthOverflow] = React.useState(false);
  const textStr = extractTextFromNode(text);
  const { flatLabel, hasComputedTruncation, hasLengthFallbackOverflow, visibleLines } = getTruncatedTextState(text, maxLength);

  React.useLayoutEffect(() => {
    if (typeof window === "undefined" || hasComputedTruncation) {
      return;
    }

    const element = triggerRef.current;
    if (!element) {
      return;
    }

    const measureOverflow = () => {
      const lineElements = Array.from(element.querySelectorAll<HTMLElement>("[data-truncated-text-line]"));

      if (lineElements.length > 0) {
        setHasWidthOverflow(lineElements.some((lineElement) => lineElement.scrollWidth - lineElement.clientWidth > 1));
        return;
      }

      setHasWidthOverflow(element.scrollWidth - element.clientWidth > 1);
    };

    measureOverflow();

    if (typeof ResizeObserver === "function") {
      const resizeObserver = new ResizeObserver(measureOverflow);
      resizeObserver.observe(element);
      for (const lineElement of element.querySelectorAll<HTMLElement>("[data-truncated-text-line]")) {
        resizeObserver.observe(lineElement);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }

    window.addEventListener("resize", measureOverflow);
    return () => {
      window.removeEventListener("resize", measureOverflow);
    };
  }, [hasComputedTruncation, textStr]);

  const shouldShowPopover = hasComputedTruncation || hasWidthOverflow || hasLengthFallbackOverflow;
  const visibleTextNode = visibleLines.map((line: string) => (
    <span key={line} data-truncated-text-line className="block w-full min-w-0 max-w-full truncate">
      {line}
    </span>
  ));

  if (!shouldShowPopover) {
    return (
      <span
        ref={triggerRef as React.Ref<HTMLSpanElement>}
        className={cn("block w-full min-w-0 max-w-full overflow-hidden align-top", className)}
        title={title ?? flatLabel}
      >
        {visibleTextNode}
      </span>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {as === "button" ? (
          <button
            ref={triggerRef as React.Ref<HTMLButtonElement>}
            type="button"
            className={cn(
              "block w-full min-w-0 max-w-full overflow-hidden align-top hover:underline focus:outline-none bg-transparent",
              className
            )}
            title={title ?? flatLabel}
            aria-label={title ?? flatLabel}
          >
            {visibleTextNode}
          </button>
        ) : (
          <span
            ref={triggerRef as React.Ref<HTMLSpanElement>}
            role="button"
            tabIndex={0}
            className={cn(
              "block w-full min-w-0 max-w-full overflow-hidden align-top hover:underline focus:outline-none bg-transparent",
              className
            )}
            title={title ?? flatLabel}
            aria-label={title ?? flatLabel}
          >
            {visibleTextNode}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="center"
        sideOffset={6}
        collisionPadding={16}
        className={cn(
          "z-50 break-all rounded-lg border border-[#1B0F004D] bg-elevation-50 p-4 text-center shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          contentClassName
        )}
      >
        <span className="text-sm whitespace-pre-line">{textStr}</span>
      </PopoverContent>
    </Popover>
  );
}
