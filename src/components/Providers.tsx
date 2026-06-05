"use client";

import { SessionProvider } from "next-auth/react";
import { LocaleProvider } from "@/components/LocaleProvider";
import { PageViewTracker } from "@/components/PageViewTracker";
import { ViewportScene } from "@/components/ViewportScene";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocaleProvider>
        <PageViewTracker />
        <ViewportScene>{children}</ViewportScene>
      </LocaleProvider>
    </SessionProvider>
  );
}
