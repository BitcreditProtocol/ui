import type React from "react";
import { useCallback, useEffect } from "react";

import { IOS_STANDALONE_KEYBOARD_ACCESSORY_OFFSET_PX, IOS_STANDALONE_MIN_DROPDOWN_HEIGHT_PX } from "./constants";

type Params = {
  isOpen: boolean;
  isIOSStandalone: boolean;
  bottomClearance: number;
  topClearance: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useCountrySelectorStandaloneIOS({
  isOpen,
  isIOSStandalone,
  bottomClearance,
  topClearance,
  containerRef,
  triggerRef,
  setOpen,
}: Params) {
  const scrollTriggerIntoView = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const scrollContainer = trigger.closest(".page-scroll-container");
    if (scrollContainer instanceof HTMLElement) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const offsetTop = triggerRect.top - containerRect.top + scrollContainer.scrollTop;
      const targetTop = Math.max(0, offsetTop - scrollContainer.clientHeight / 2 + triggerRect.height / 2);

      scrollContainer.scrollTo({
        top: targetTop,
        behavior: "auto",
      });
      return;
    }

    if (typeof trigger.scrollIntoView === "function") {
      trigger.scrollIntoView({
        block: "center",
        inline: "nearest",
      });
    }
  }, [triggerRef]);

  const ensureStandaloneBottomSpace = useCallback(() => {
    if (!isIOSStandalone) {
      return;
    }

    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const scrollContainer = trigger.closest(".page-scroll-container");
    if (!(scrollContainer instanceof HTMLElement)) {
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const viewport = window.visualViewport;
    const viewportTop = Math.floor(viewport?.offsetTop ?? 0);
    const viewportHeight = Math.floor(viewport?.height ?? window.innerHeight);
    const viewportBottom = viewportTop + viewportHeight;
    const padding = 16;
    const usableBottom = viewportBottom - IOS_STANDALONE_KEYBOARD_ACCESSORY_OFFSET_PX - bottomClearance - padding;
    const currentSpaceBelow = usableBottom - triggerRect.bottom;
    const missingSpace = IOS_STANDALONE_MIN_DROPDOWN_HEIGHT_PX - currentSpaceBelow;

    if (missingSpace <= 0) {
      return;
    }

    scrollContainer.scrollTo({
      top: Math.max(0, scrollContainer.scrollTop + missingSpace + padding),
      behavior: "auto",
    });
  }, [bottomClearance, isIOSStandalone, triggerRef]);

  const ensureTriggerVisible = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    if (isIOSStandalone) {
      scrollTriggerIntoView();
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const viewport = window.visualViewport;
    const viewportTop = viewport?.offsetTop ?? 0;
    const viewportHeight = viewport?.height ?? window.innerHeight;
    const keyboardInset = Math.max(0, window.innerHeight - viewportHeight - viewportTop);
    const viewportBottom = viewportTop + viewportHeight;
    const reservedTop = viewportTop + topClearance;
    const reservedBottom = keyboardInset + bottomClearance;
    const tolerance = 8;

    const isAboveViewport = rect.top < reservedTop + tolerance;
    const isBelowViewport = rect.bottom > viewportBottom - reservedBottom - tolerance;

    if (!isAboveViewport && !isBelowViewport) {
      return;
    }

    if (typeof trigger.scrollIntoView === "function") {
      trigger.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [bottomClearance, isIOSStandalone, scrollTriggerIntoView, topClearance, triggerRef]);

  useEffect(() => {
    if (!isOpen || !isIOSStandalone) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target || containerRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef, isIOSStandalone, isOpen, setOpen]);

  return {
    ensureStandaloneBottomSpace,
    ensureTriggerVisible,
  };
}
