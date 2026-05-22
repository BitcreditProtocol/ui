export const IOS_BOTTOM_NAV_SAFE_AREA_OFFSET = "max(calc(env(safe-area-inset-bottom, 0px) - 1rem), 0px)";

// iOS standalone mode can report viewport space that still sits under the status bar
// and app top bar. Country selector popovers should not open into that region.
export const IOS_STANDALONE_POPOVER_TOP_CLEARANCE_PX = 88;
