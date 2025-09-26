"use client";

import { useState } from "react";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";

import config from "./rainbowKitConfig";
import { store } from "@/store";

import "@rainbow-me/rainbowkit/styles.css";

export const RootProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider store={store}>
          <RainbowKitProvider theme={lightTheme({ borderRadius: "medium" })}>
            {children}
          </RainbowKitProvider>
        </JotaiProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
