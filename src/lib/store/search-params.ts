import type { ReadonlyURLSearchParams } from "next/navigation";

class SearchParamsStore {
  private params: ReadonlyURLSearchParams;
  private listeners: Set<() => void>;
  private writeTracker: Map<string, { id: string; timestamp: number }>;

  constructor() {
    this.params = new URLSearchParams(window.location.search);
    this.listeners = new Set();
    this.writeTracker = new Map();

    window.addEventListener("popstate", this.handlePopState);
  }

  private handlePopState() {
    const newParams = new URLSearchParams(window.location.search);
    if (newParams.toString() !== this.params.toString()) {
      this.params = newParams;
      this.notifyListeners();
    }
  }

  getSnapshot() {
    return this.params;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setParams(newParams: URLSearchParams, locationId: string) {
    if (newParams.toString() === this.params.toString()) return;

    const currentKeys = Array.from(this.params.keys());
    const newKeys = Array.from(newParams.keys());

    const changedOrNewKeys = newKeys.filter(
      (key) =>
        newParams.get(key) !== this.params.get(key) ||
        !currentKeys.includes(key),
    );

    for (const key of changedOrNewKeys) {
      const existingTracker = this.writeTracker.get(key);
      if (existingTracker && existingTracker.id !== locationId) {
        console.warn(
          `Multiple locations (${existingTracker.id}, ${locationId}) are attempting to write to the same URL search param key. '${key}'.`,
        );
      }

      this.writeTracker.set(key, {
        id: locationId,
        timestamp: Date.now(),
      });
    }

    this.params = newParams;

    const newSearch = newParams.toString();
    if (newSearch !== window.location.search.slice(1)) {
      const newUrl = newSearch
        ? `${window.location.pathname}?${newSearch}${window.location.hash}`
        : `${window.location.pathname}${window.location.hash}`;
      window.history.pushState({}, "", newUrl);
    }

    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

const store = new SearchParamsStore();

export { store };
