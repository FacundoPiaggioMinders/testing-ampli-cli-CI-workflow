"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics";

export function AmplitudeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAnalytics();
  }, []);

  return <>{children}</>;
}
