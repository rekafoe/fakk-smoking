import type { Metadata } from "next";
import { Anton, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "@/app/globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  variable: "--font-ui",
  weight: ["400", "500", "600", "700"],
});

const anton = Anton({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  weight: "400",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "fakksmoking — quit tracker",
  description: "Track days without nicotine, healing progress, and emergency craving support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${anton.variable} ${mono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
