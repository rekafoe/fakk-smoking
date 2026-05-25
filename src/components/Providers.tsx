"use client";

import { SessionProvider } from "next-auth/react";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { LocaleProvider } from "@/components/LocaleProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocaleProvider>
        <BackgroundEffects />
        {children}
      </LocaleProvider>
    </SessionProvider>
  );
}
