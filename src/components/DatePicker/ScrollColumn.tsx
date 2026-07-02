import React, { useCallback, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ITEM_H, REPEAT_COUNT, VISIBLE_COUNT } from "./scrollColumnConstants";

export function ScrollColumn({
  items,
  selectedIndex,
  onChange,
  disabled,
  infinite = true,
}: {
  items: string[];
  selectedIndex: number;
  onChange: (i: number) => void;
  disabled?: boolean;
  infinite?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isProgrammatic = React.useRef(false);
  const mounted = React.useRef(false);
  const debounce = React.useRef<number | null>(null);
  // For infinite columns: always snap back to the middle repetition
  const middleStart = infinite ? items.length * Math.floor(REPEAT_COUNT / 2) : 0;

  const commit = useCallback(() => {
    if (isProgrammatic.current) return;
    const el = ref.current;
    if (!el) return;
    const virtualIndex = Math.round(el.scrollTop / ITEM_H);
    if (infinite) {
      const normalized = ((virtualIndex % items.length) + items.length) % items.length;
      onChange(normalized);
      // Instantly re-anchor to the middle repetition so scroll stays infinite
      isProgrammatic.current = true;
      el.scrollTop = (middleStart + normalized) * ITEM_H;
      window.setTimeout(() => {
        isProgrammatic.current = false;
      }, 50);
    } else {
      const normalized = Math.max(0, Math.min(items.length - 1, virtualIndex));
      onChange(normalized);
    }
  }, [infinite, items.length, middleStart, onChange]);

  // scrollend fires after momentum finishes (Chrome 114+, FF 109+)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScrollEnd = () => {
      if (debounce.current !== null) {
        window.clearTimeout(debounce.current);
        debounce.current = null;
      }
      commit();
    };
    el.addEventListener("scrollend", onScrollEnd, { passive: true });
    return () => el.removeEventListener("scrollend", onScrollEnd);
  }, [commit]);

  // Debounce fallback for browsers without scrollend
  const handleScroll = useCallback(() => {
    if (isProgrammatic.current) return;
    if (debounce.current !== null) window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => {
      commit();
      debounce.current = null;
    }, 80);
  }, [commit]);

  // Scroll to selectedIndex in the middle repetition
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    isProgrammatic.current = true;
    const top = (middleStart + selectedIndex) * ITEM_H;
    if (!mounted.current) {
      mounted.current = true;
      el.scrollTop = top;
      isProgrammatic.current = false;
    } else {
      el.scrollTo({ top, behavior: "smooth" });
      const t = window.setTimeout(() => {
        isProgrammatic.current = false;
      }, 400);
      return () => window.clearTimeout(t);
    }
  }, [selectedIndex, middleStart]);

  const allItems = useMemo(() => (infinite ? Array.from({ length: REPEAT_COUNT }, () => items).flat() : items), [infinite, items]);
  const pad = Math.floor(VISIBLE_COUNT / 2) * ITEM_H;

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      style={{
        height: ITEM_H * VISIBLE_COUNT,
        maskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
        scrollbarWidth: "none",
      }}
      className={cn(
        "overflow-y-scroll snap-y snap-mandatory overscroll-y-contain touch-pan-y [&::-webkit-scrollbar]:hidden w-12",
        disabled && "pointer-events-none opacity-40"
      )}
    >
      <div style={{ height: pad }} aria-hidden />
      {allItems.map((item, i) => {
        const normalizedI = i % items.length;
        const isSelected = normalizedI === selectedIndex;
        return (
          <div
            key={i}
            style={{ height: ITEM_H }}
            className={cn(
              "snap-center flex items-center justify-center select-none",
              isSelected ? "font-semibold text-base" : "text-text-200 text-sm cursor-pointer"
            )}
            onClick={() => {
              if (disabled) return;
              onChange(normalizedI);
            }}
          >
            {item}
          </div>
        );
      })}
      <div style={{ height: pad }} aria-hidden />
    </div>
  );
}
