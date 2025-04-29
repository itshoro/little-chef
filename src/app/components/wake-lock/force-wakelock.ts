"use client";

import { useWakeLock } from "./hook";
import { useEffect } from "react";

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
