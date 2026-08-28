import { IBM_Plex_Serif, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexSerif = IBM_Plex_Serif({
  weight: ["600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-serif",
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

export const metadata = {
  title: "Recall",
  description: "Turn your notes into a test.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSerif.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'var(--font-ibm-plex-sans)' }}>{children}</body>
    </html>
  );
}
