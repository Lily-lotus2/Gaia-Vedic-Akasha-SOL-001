import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Existon 1.0 - Information-Theoretic Analysis',
  description: 'Real-time entropy analysis, correlation networks, and AI reasoning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}
