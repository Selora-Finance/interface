'use client';

import { Card } from '@/components';
import { Themes } from '@/constants';
import useStats from '@/hooks/useStats';
import { formatNumber } from '@/lib/client/utils';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

export default function Stats() {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);

  // Fetch stats every 60 seconds
  const statistics = useStats(60000);

  const stats = useMemo(
    () => [
      { label: 'Total Value Locked', value: formatNumber(statistics?.totalVolumeLockedUSD || '0', undefined, 4, true) },
      {
        label: 'Total Trading Volume',
        value: formatNumber(statistics?.totalTradeVolumeUSD || '0', undefined, 4, true),
      },
      { label: 'Total Fees', value: formatNumber(statistics?.totalFeesUSD || '0', undefined, 4, true) },
    ],
    [statistics?.totalFeesUSD, statistics?.totalTradeVolumeUSD, statistics?.totalVolumeLockedUSD],
  );
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
