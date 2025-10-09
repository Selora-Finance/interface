import { Themes } from '@/constants';
import { createStore } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type SelectedSwapTokens = {
  token0: string;
  token1: string;
};

// Misc
export const themeAtom = atomWithStorage<Themes>('theme', Themes.LIGHT);

// Export store
export const store = createStore();
