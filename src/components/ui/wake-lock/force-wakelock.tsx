"use client";

import { useEffect } from "react";
import { useWakeLock } from "../../../hooks/use-wake-lock";

const ForceWakeLock = () => {
  const { requestLock, releaseLock } = useWakeLock();

  useEffect(() => {
    requestLock();

    return () => {
      releaseLock();
    };
  }, [requestLock, releaseLock]);

  return null;
};

export { ForceWakeLock, useWakeLock };
