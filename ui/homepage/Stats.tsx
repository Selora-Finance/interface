'use client';

import { Card } from '@/components';
import { Themes } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

const stats = [
  { label: 'Total Value Locked', value: '$0' },
  { label: 'Daily Volume', value: '$0' },
  { label: 'Daily Fees', value: '$0' },
];

export default function Stats() {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  return (
    <section className="w-full mx-auto flex flex-col md:flex-row justify-center items-center gap-4 px-4 py-12">
      {stats.map(stat => (
        <Card
          key={stat.label}
          variant={isDarkMode ? 'neutral' : 'primary'}
          className="shadow p-12 flex flex-col gap-4 justify-center items-center w-full md:w-1/4"
        >
          <h3>{stat.label}</h3>
          <p className="text-2xl font-bold">{stat.value}</p>
        </Card>
      ))}
    </section>
  );
}
