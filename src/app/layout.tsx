import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteDescription =
  "TBN Store — sweaters, tracksuits, and matching outfit sets for kids. Browse online, book what you like, and we'll call to confirm sizing and delivery.";

export const metadata: Metadata = {
  metadataBase: new URL("https://tbnstore.vercel.app"),
  title: {
    default: "TBN Store — Kids Clothing Store",
    template: "%s | TBN Store",
  },
  description: siteDescription,
  openGraph: {
    title: "TBN Store — Kids Clothing Store",
    description: siteDescription,
    url: "/",
    siteName: "TBN Store",
    images: [{ url: "/logo.png", width: 1254, height: 1254, alt: "TBN Store" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TBN Store — Kids Clothing Store",
    description: siteDescription,
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
