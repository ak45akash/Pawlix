import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import Script from "next/script";
import { getSiteUrl } from "@/config/env";
import { siteConfig } from "@/config/site";
import "./globals.css";

const themeBootScript = `(function(){try{var t=localStorage.getItem("pawlix-theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}}catch(e){}})();`;

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${plusJakarta.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <Script id="pawlix-theme" strategy="beforeInteractive">
          {themeBootScript}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
