import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { IOS_STANDALONE_KEYBOARD_ACCESSORY_OFFSET_PX } from "./constants";

type Params = {
  isOpen: boolean;
  value?: string;
  isIOSStandalone: boolean;
  topClearance: number;
  bottomClearance: number;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  selectedItemRef: React.RefObject<HTMLDivElement | null>;
  ensureTriggerVisible: () => void;
  ensureStandaloneBottomSpace: () => void;
};

export function useCountrySelectorPosition({
  isOpen,
  value,
  isIOSStandalone,
  topClearance,
  bottomClearance,
  triggerRef,
  searchInputRef,
  selectedItemRef,
  ensureTriggerVisible,
  ensureStandaloneBottomSpace,
}: Params) {
  const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
  const [contentSide, setContentSide] = useState<"top" | "bottom">("bottom");
  const [contentMaxHeight, setContentMaxHeight] = useState(360);
  const timeoutRefs = useRef<number[]>([]);
  const hasOpenedOnce = useRef(false);
  const wasOpenRef = useRef(false);

  const recomputePosition = useCallback(
    (isForced = false) => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const viewport = window.visualViewport;
      const viewportTop = Math.floor(viewport?.offsetTop ?? 0);
      const viewportHeight = Math.floor(viewport?.height ?? window.innerHeight);
      const keyboardInset = Math.max(0, Math.floor(window.innerHeight - viewportHeight - viewportTop));
      const viewportBottom = viewportTop + viewportHeight;
      const reservedTop = viewportTop + topClearance;
      const padding = 16;
      const reservedBottom = (isIOSStandalone ? IOS_STANDALONE_KEYBOARD_ACCESSORY_OFFSET_PX : keyboardInset) + bottomClearance + padding;

      const spaceAbove = Math.max(0, rect.top - reservedTop - padding);
      const spaceBelow = Math.max(0, viewportBottom - rect.bottom - reservedBottom);

      const isBottomPreferred = isIOSStandalone || spaceBelow >= 240 || spaceBelow >= spaceAbove;
      const side = isBottomPreferred ? "bottom" : "top";
      const available = isBottomPreferred ? spaceBelow : spaceAbove;
      const nextMaxHeight = Math.max(120, Math.min(400, Math.floor(available)));

      if (isForced) {
        setContentSide(side);
        setContentMaxHeight(nextMaxHeight);
        return;
      }

      setContentSide((current) => {
        if (current === side) return current;
        const currentSpace = current === "bottom" ? spaceBelow : spaceAbove;
        const candidateSpace = side === "bottom" ? spaceBelow : spaceAbove;
        return candidateSpace > currentSpace + 80 ? side : current;
      });
      setContentMaxHeight((current) => (Math.abs(current - nextMaxHeight) > 20 ? nextMaxHeight : current));
    },
    [bottomClearance, isIOSStandalone, topClearance, triggerRef]
  );

  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach((id) => {
      window.clearTimeout(id);
    });
    timeoutRefs.current = [];
  }, []);

  useEffect(() => {
    if (!isOpen) {
      clearAllTimeouts();
      hasOpenedOnce.current = false;
      return;
    }

    if (!hasOpenedOnce.current) {
      const frameId = window.requestAnimationFrame(() => {
        recomputePosition(true);
      });
      hasOpenedOnce.current = true;

      return () => {
        window.cancelAnimationFrame(frameId);
        clearAllTimeouts();
      };
    }

    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts, isOpen, recomputePosition]);

  useEffect(() => {
    if (!triggerRef.current) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      setTriggerWidth(triggerRef.current?.offsetWidth ?? null);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isOpen, triggerRef]);

  useEffect(() => {
    if (!isOpen) {
      wasOpenRef.current = false;
      return;
    }

    const isOpening = !wasOpenRef.current;
    wasOpenRef.current = true;

    if (!isOpening) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      ensureTriggerVisible();
      ensureStandaloneBottomSpace();
      recomputePosition(true);
      if (isIOSStandalone && typeof searchInputRef.current?.focus === "function") {
        searchInputRef.current.focus();
      }
      if (typeof selectedItemRef.current?.scrollIntoView === "function") {
        selectedItemRef.current.scrollIntoView({ block: "nearest" });
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [
    ensureStandaloneBottomSpace,
    ensureTriggerVisible,
    isIOSStandalone,
    isOpen,
    recomputePosition,
    searchInputRef,
    selectedItemRef,
    value,
  ]);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") {
      return;
    }

    let frameId: number | null = null;

    const handleViewportResize = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        ensureStandaloneBottomSpace();
        recomputePosition(true);
        frameId = null;
      });
    };

    const handleViewportScroll = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        recomputePosition(true);
        frameId = null;
      });
    };

    window.addEventListener("resize", handleViewportResize);
    window.visualViewport?.addEventListener("resize", handleViewportResize);
    window.visualViewport?.addEventListener("scroll", handleViewportScroll);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("resize", handleViewportResize);
      window.visualViewport?.removeEventListener("resize", handleViewportResize);
      window.visualViewport?.removeEventListener("scroll", handleViewportScroll);
    };
  }, [ensureStandaloneBottomSpace, isOpen, recomputePosition]);

  const popoverContentStyle = useMemo(
    () => ({
      width: triggerWidth ? `${String(triggerWidth)}px` : "var(--radix-popover-trigger-width)",
      minWidth: "300px",
      maxHeight: `${String(contentMaxHeight)}px`,
      overflow: "hidden" as const,
      display: "flex" as const,
      flexDirection: "column" as const,
    }),
    [contentMaxHeight, triggerWidth]
  );

  return {
    contentSide,
    popoverContentStyle,
    recomputePosition,
  };
}
