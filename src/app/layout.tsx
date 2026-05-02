import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AGROGUARD AI — Precision Crop Intelligence Platform',
  description:
    "The world's fastest AI-powered crop disease detection pipeline. Identify pathogens at the cellular level before they destroy your harvest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
