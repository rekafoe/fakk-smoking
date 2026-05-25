"use client";

import { SessionProvider } from "next-auth/react";
import { LocaleProvider } from "@/components/LocaleProvider";
import { ViewportScene } from "@/components/ViewportScene";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocaleProvider>
        <ViewportScene>{children}</ViewportScene>
      </LocaleProvider>
    </SessionProvider>
  );
}
