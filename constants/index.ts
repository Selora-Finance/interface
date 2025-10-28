export const MAX_SCREEN_SIZES = {
  MOBILE: 767,
  TABLET: 1024,
  DESKTOP: Number.MAX_SAFE_INTEGER,
};

export enum Themes {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum RouterType {
  AUTO = 'Auto',
  V2 = 'V2',
  V3 = 'V3',
}

export enum Chains {
  FLUENT_TESTNET = 20994,
}

export const DEFAULT_PROCESS_DURATION = 5000;
export const BASE_POINT = 1000;
export const MIN_IN_SEC = 3600;
export const REFETCH_INTERVALS = 10000;

// Bigints
export const BI_ZERO = BigInt(0);

// Chain parameters
export const ETHER = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
export const V2_ROUTERS: { [key: number]: `0x${string}` } = {
  [Chains.FLUENT_TESTNET]: '0x2076646F5Bb03063F4Ae6d2b85282CfCEE9d1eE1',
};
export const NFPM: { [key: number]: `0x${string}` } = {
  [Chains.FLUENT_TESTNET]: '0x24e95fe9fF4D4F988911cfd9A5D9443b3E640C22',
};
export const AUTO_SWAP_EXECUTORS: { [key: number]: `0x${string}` } = {
  [Chains.FLUENT_TESTNET]: '0x037A4493CC949Ad4f9dbf8CcAeF558B6DEd26218',
};
export const V2_SWAP_EXECUTORS: { [key: number]: `0x${string}` } = {
  [Chains.FLUENT_TESTNET]: '0x57953bB66b17032DeA780e7e078bc887F6Bae9Bc',
};
export const V3_SWAP_EXECUTORS: { [key: number]: `0x${string}` } = {
  [Chains.FLUENT_TESTNET]: '0xcaBcFED4a3F7420B11133D31fF79A57353234D91',
};
export const WETH: { [key: number]: `0x${string}` } = {
  [Chains.FLUENT_TESTNET]: '0x3d38E57b5d23c3881AffB8BC0978d5E0bd96c1C6',
};
export const V2_FACTORY: { [key: number]: `0x${string}` } = {
  [Chains.FLUENT_TESTNET]: '0x57086f4122471783E78A72Bd2aE8db74cb5c403A',
};
export const V3_FACTORY: { [key: number]: `0x${string}` } = {
  [Chains.FLUENT_TESTNET]: '0x74359B347D1225377577091392360C3FA0464468',
};
export const ORACLE: { [key: number]: `0x${string}` } = {
  [Chains.FLUENT_TESTNET]: '0x4186F4901Ac2ED69a137bd6eC9187E0b4601d3C2',
};
export const EXPLORERS: { [key: number]: string } = {
  [Chains.FLUENT_TESTNET]: 'https://testnet.fluentscan.xyz',
};
