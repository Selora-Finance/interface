"use client";

import { createConfig, http } from "wagmi";
import { Chain } from "wagmi/chains";
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
  trustWallet,
  ledgerWallet,
  phantomWallet,
  injectedWallet,
  safeWallet,
  zerionWallet,
  rabbyWallet,
  braveWallet,
  okxWallet,
  bitgetWallet,
  argentWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

const fluentTestnet: Chain = {
  id: 20994,
  name: "Fluent Testnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.fluent.xyz/"],
    },
    public: {
      http: ["https://rpc.testnet.fluent.xyz/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Fluentscan",
      url: "https://testnet.fluentscan.xyz/",
    },
  },
  testnet: true,
} as const satisfies Chain;

// Define wallet groups
const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        coinbaseWallet,
        rainbowWallet,
        trustWallet,
      ],
    },
    {
      groupName: "Hardware",
      wallets: [
        ledgerWallet,
      ],
    },
    {
      groupName: "Browser & Mobile",
      wallets: [
        phantomWallet,
        braveWallet,
        zerionWallet,
        rabbyWallet,
        okxWallet,
        bitgetWallet,
      ],
    },
    {
      groupName: "Smart Wallets",
      wallets: [
        safeWallet,
        argentWallet,
      ],
    },
    {
      groupName: "Other",
      wallets: [
        injectedWallet,
      ],
    },
  ],
  {
    appName: "Selora Finance",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  }
);

const config = createConfig({
  connectors,
  chains: [fluentTestnet],
  transports: {
    [fluentTestnet.id]: http(),
  },
  ssr: true,
});

export default config;