import { ChevronDown } from "lucide-react";
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { AppIcon } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";

const Drawer = ({
  shouldScaleBackground = false,
  modal: isModal = true,
  open: isOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => {
  React.useEffect(() => {
    if (isOpen && isModal) {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement !== document.body && !activeElement.closest('[role="dialog"]')) {
        activeElement.blur();
      }
    }
  }, [isOpen, isModal]);

  return (
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      modal={isModal}
      open={isOpen}
      onOpenChange={onOpenChange}
      {...props}
    />
  );
};
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
      className
    )}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & { showHandle?: boolean }
>(({ className, children, onOpenAutoFocus, showHandle = false, ...props }, ref) => {
  const handleOpenAutoFocus = React.useCallback(
    (event: Event) => {
      event.preventDefault();

      const activeElement = document.activeElement as HTMLElement;
      if (activeElement !== document.body) {
        activeElement.blur();
      }

      onOpenAutoFocus?.(event);
    },
    [onOpenAutoFocus]
  );

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed bottom-0 left-1/2 z-50 mt-24 flex h-auto w-full max-w-[430px] -translate-x-1/2 flex-col rounded-t-2xl border bg-elevation-50 data-[state=closed]:pointer-events-none dark:bg-elevation-250",
          className
        )}
        aria-modal="true"
        role="dialog"
        tabIndex={undefined}
        onOpenAutoFocus={handleOpenAutoFocus}
        {...props}
      >
        {showHandle && <div className="mx-auto mt-4 h-2 w-[70px] rounded-full bg-elevation-300" />}
        <div className={cn(!showHandle && "pt-6")}>{children}</div>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";

const DrawerScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    viewportClassName?: string;
    fadeClassName?: string;
    indicatorClassName?: string;
  }
>(({ children, className, viewportClassName, fadeClassName, indicatorClassName, ...props }, ref) => {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [showBottomFade, setShowBottomFade] = React.useState(false);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      viewportRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  const updateScrollState = React.useCallback(() => {
    const element = viewportRef.current;
    if (!element) {
      setShowBottomFade(false);
      return;
    }

    const hasOverflow = element.scrollHeight - element.clientHeight > 1;
    const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 1;
    setShowBottomFade(hasOverflow && !isAtBottom);
  }, []);

  React.useEffect(() => {
    updateScrollState();

    const element = viewportRef.current;
    if (!element) return;

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateScrollState);
      return () => {
        window.removeEventListener("resize", updateScrollState);
      };
    }

    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });

    resizeObserver.observe(element);
    if (element.firstElementChild) {
      resizeObserver.observe(element.firstElementChild);
    }

    window.addEventListener("resize", updateScrollState);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [children, updateScrollState]);

  return (
    <div className={cn("relative min-h-0", className)}>
      <div ref={setRefs} onScroll={updateScrollState} className={cn("min-h-0 overflow-y-auto", viewportClassName)} {...props}>
        {children}
      </div>
      {showBottomFade ? (
        <>
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-elevation-50 via-elevation-50/90 to-transparent dark:from-elevation-250 dark:via-elevation-250/90",
              fadeClassName
            )}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
            <div
              aria-hidden="true"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border border-divider-100 bg-elevation-50 text-text-300 shadow-sm dark:bg-elevation-250",
                indicatorClassName
              )}
            >
              <AppIcon icon={ChevronDown} className="h-4 w-4" />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
});
DrawerScrollArea.displayName = "DrawerScrollArea";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerScrollArea,
  DrawerTitle,
  DrawerTrigger,
};
