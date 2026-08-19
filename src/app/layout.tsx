import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#060A04',
};

export const metadata: Metadata = {
  title: 'CropGuard AI — Precision Crop Intelligence Platform',
  description:
    "The world's fastest AI-powered crop disease detection pipeline. Identify pathogens at the cellular level before they destroy your harvest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden w-full max-w-full bg-[#060A04]">
      <body className="overflow-x-hidden w-full max-w-full m-0 p-0 bg-[#060A04] text-white antialiased selection:bg-[#C8F53E] selection:text-[#060A04]">
        <AuthProvider>
          <div className="w-full max-w-full overflow-x-hidden min-h-screen flex flex-col justify-between">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}


