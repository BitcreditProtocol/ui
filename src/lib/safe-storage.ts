type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

function getStorage(): StorageLike | null {
  try {
    const storage = globalThis.localStorage as unknown as Partial<StorageLike> | undefined;
    if (
      storage &&
      typeof storage.getItem === "function" &&
      typeof storage.setItem === "function" &&
      typeof storage.removeItem === "function" &&
      typeof storage.clear === "function"
    ) {
      return storage as StorageLike;
    }
  } catch {
    return null;
  }
  return null;
}

export function safeStorageGet(key: string): string | null {
  try {
    return getStorage()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function safeStorageSet(key: string, value: string): void {
  try {
    getStorage()?.setItem(key, value);
  } catch {
    // ignore storage write errors in non-browser/test environments
  }
}
