import type { Metadata } from 'next';
import './globals.css';
import { RootProvider } from './__providers__';
import { AppView } from './__render__';

export const metadata: Metadata = {
  title: 'Selora Finance | Central liquidity & trading marketplace on Fluent',
  description:
    'Selora is the central trading and liquidity marketplace built on Fluent. It uses ve(3,3) model to align incentives between liquidity providers, traders, and protocols. Our goal is simple but powerful: fix liquidity in DeFi through aligned incentives, sustainable emissions, and vote-driven liquidity markets.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <RootProvider>
        <AppView>{children}</AppView>
      </RootProvider>
    </html>
  );
}
