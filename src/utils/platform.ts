const isBrowser = () => typeof window !== "undefined" && typeof navigator !== "undefined";

export function isAndroid(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return /android/i.test(navigator.userAgent);
}

export function isIOS(): boolean {
  if (!isBrowser()) {
    return false;
  }

  const ua = navigator.userAgent || "";
  const isIPadOSDesktopClass = ua.includes("Macintosh") && navigator.maxTouchPoints > 1;

  return /iPad|iPhone|iPod/.test(ua) || isIPadOSDesktopClass;
}

export function isInStandaloneMode(): boolean {
  if (!isBrowser()) {
    return false;
  }

  const standaloneNavigator = navigator as Navigator & { standalone?: boolean };

  return window.matchMedia?.("(display-mode: standalone)").matches === true || standaloneNavigator.standalone === true;
}
