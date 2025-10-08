'use client';

import { useMemo, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, lightTheme, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider, useAtom } from 'jotai';

import config from '../config/rainbowKit';
import { store, themeAtom } from '@/store';
import { Themes } from '@/constants';
import { AssetsListProvider } from '@/context/assets';

export const RootProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AssetsListProvider>
          <JotaiProvider store={store}>
            {(() => {
              const [theme] = useAtom(themeAtom);
              const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
              const kitTheme = useMemo(() => {
                return isDarkMode ? darkTheme() : lightTheme();
              }, [isDarkMode]);
              return (
                <RainbowKitProvider modalSize="compact" theme={kitTheme} key={theme}>
                  {children}
                </RainbowKitProvider>
              );
            })()}
          </JotaiProvider>
        </AssetsListProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
