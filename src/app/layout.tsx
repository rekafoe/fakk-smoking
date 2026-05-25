import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Mono, Oswald } from "next/font/google";
import { Providers } from "@/components/Providers";
import "@/app/globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["300", "400", "500", "600"],
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
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
    <html lang="en" className={`${oswald.variable} ${bebas.variable} ${mono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
