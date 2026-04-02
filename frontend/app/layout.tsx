import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BELLAQA GmbH — Distribution Portal',
  description: 'Enterprise B2B/B2C food distribution platform for Germany',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
