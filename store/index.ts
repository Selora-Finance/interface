import { RouterType, Themes } from '@/constants';
import { createStore } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Misc
export const themeAtom = atomWithStorage<Themes>('theme', Themes.LIGHT);

// Transactions
export const slippageToleranceAtom = atomWithStorage<number>('slippageTolerance', 0.1);
export const routerTypeAtom = atomWithStorage<RouterType>('routerType', RouterType.AUTO);
export const deadlineAtom = atomWithStorage<number | undefined>('transactionDeadlineInMinutes', 10);

// Export store
export const store = createStore();
