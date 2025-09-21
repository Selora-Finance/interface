'use client';

import { Provider as JotaiProvider } from 'jotai';
import { store } from '@/store';

export const RootProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <JotaiProvider store={store}>{children}</JotaiProvider>;
};
