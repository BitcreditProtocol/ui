export const ITEM_H = 40;
export const VISIBLE_COUNT = 5;
export const REPEAT_COUNT = 5; // repeat item list this many times for infinite illusion
export const HOURS_24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
export const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
export const MINUTES_LIST = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
export const AM_PM = ["AM", "PM"];
