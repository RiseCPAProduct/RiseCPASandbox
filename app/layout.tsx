import type { Metadata } from "next";
import { Open_Sans, Roboto } from "next/font/google";
import "./globals.css";

// RISE CPA branding: Roboto Bold for headings, Open Sans for body text.
const roboto = Roboto({
  variable: "--font-roboto",
  weight: "700",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RISE CPA Intranet",
  description: "Sandbox prototype of the RISE CPA intranet single-page hub",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
