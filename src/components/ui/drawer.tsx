import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

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
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, onOpenAutoFocus, ...props }, ref) => {
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
          "fixed bottom-0 left-1/2 z-50 mt-24 flex h-auto w-full -translate-x-1/2 flex-col rounded-t-2xl border bg-elevation-50 data-[state=closed]:pointer-events-none dark:bg-elevation-250",
          className
        )}
        aria-modal="true"
        role="dialog"
        tabIndex={undefined}
        onOpenAutoFocus={handleOpenAutoFocus}
        {...props}
      >
        <div className="mx-auto mt-4 h-2 w-[70px] rounded-full bg-elevation-300" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";

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
  DrawerTitle,
  DrawerTrigger,
};
