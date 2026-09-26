import type { Metadata } from 'next';
import './globals.css';
import AppProvider from '@/lib/AppProvider';

export const metadata: Metadata = {
  title: 'Templator for AIA',
  description: 'AIA Singapore poster templating tool',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
