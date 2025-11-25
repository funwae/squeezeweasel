"use client";

import * as React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    document.body.classList.add("sw-dark");
    return () => {
      document.body.classList.remove("sw-dark");
    };
  }, []);

  return <>{children}</>;
}

