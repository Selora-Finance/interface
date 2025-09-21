import { Themes } from '@/constants';
import { createStore } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const themeAtom = atomWithStorage<Themes>('theme', Themes.LIGHT);

// Export store
export const store = createStore();
