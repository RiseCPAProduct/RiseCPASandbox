import type { Metadata } from "next";
import { Open_Sans, Roboto } from "next/font/google";
import AppHeader from "./components/app-header";
import AskHrChat from "./components/ask-hr-chat";
import Providers from "./providers";
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
  description: "Sandbox prototype of the RISE CPA intranet hub",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>
          <AppHeader />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 pb-24">{children}</main>
          <footer className="mx-auto w-full max-w-6xl px-4 pb-24 text-xs text-zinc-500">
            Sandbox prototype. All documents, people and policies shown are placeholder content.
          </footer>
          <AskHrChat />
        </Providers>
      </body>
    </html>
  );
}
