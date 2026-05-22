import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AfiaCare',
  description: 'Maternal health triage and referral demo rebuilt on Next.js.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
