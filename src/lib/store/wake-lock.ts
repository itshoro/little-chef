class WakeLockStore {
  #isLocked: boolean = false;
  #wakeLockSentinel: WakeLockSentinel | undefined = undefined;
  #listeners: Set<() => void> = new Set();

  getSnapshot() {
    return this.#isLocked;
  }

  subscribe(listener: () => void) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  async requestLock() {
    if (!("wakeLock" in navigator)) {
      console.warn("Wake Lock API not supported in this browser.");
      return false;
    }

    if (this.#isLocked) return true;

    try {
      const sentinel = await navigator.wakeLock.request("screen");
      this.#wakeLockSentinel = sentinel;
      this.#isLocked = true;

      sentinel.addEventListener("release", () => {
        this.#isLocked = false;
        this.#wakeLockSentinel = undefined;
        this.#notifyListeners();
      });

      this.#notifyListeners();
      return true;
    } catch (e) {
      console.error("Failed to acquire wake lock:", e);
      return false;
    }
  }

  async releaseLock() {
    if (this.#wakeLockSentinel) {
      await this.#wakeLockSentinel.release();
    }
  }

  #notifyListeners() {
    this.#listeners.forEach((listener) => listener());
  }
}

const store = new WakeLockStore();

export { store, type WakeLockStore };
