import { useCallback, useSyncExternalStore } from "react";
import { store } from "../lib/store/wake-lock";

function useWakeLock() {
  const isLocked = useSyncExternalStore(
    store.subscribe.bind(store),
    () => store.getSnapshot.bind(store)(),
    () => store.getSnapshot.bind(store)(),
  );
  const requestLock = useCallback(store.requestLock.bind(store), [store]);
  const releaseLock = useCallback(store.releaseLock.bind(store), [store]);

  return {
    isLocked,
    requestLock,
    releaseLock,
  } as const;
}

export { useWakeLock };
