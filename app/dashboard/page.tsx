'use client';

import { Card } from '@/components';
import { MAX_SCREEN_SIZES, Themes } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import DashboardCard from '@/ui/dashboard/DashboardCard';
import { useRouter } from 'next/navigation';
import { useWindowDimensions } from '@/hooks/utils';

const DashboardPage = () => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);
  const router = useRouter();

  const dashboardCards = [
    {
      id: 'lp-positions',
      title: 'Your LPs Positions',
      description: 'View and manage your liquidity positions',
      isActive: true,
      onClick: () => {
        router.push('/liquidity/positions');
      },
    },
    {
      id: 'lp-rewards',
      title: 'Your LPs Rewards',
      description: 'View and claim your liquidity rewards',
      isActive: false,
      onClick: () => {
        router.push('/liquidity/rewards');
      },
    },
    {
      id: 'locks',
      title: 'Your Locks',
      description: 'Add or remove liquidity from standard pools',
      isActive: false,
      onClick: () => {
        // Coming soon
        console.log('Coming soon');
      },
    },
    {
      id: 'voting-rewards',
      title: 'Your Voting Rewards',
      description: 'Add or remove liquidity from standard pools',
      isActive: false,
      onClick: () => {
        // Coming soon
        console.log('Coming soon');
      },
    },
  ];

  return (
    <div className="flex w-full flex-1 justify-center items-center py-6 md:py-12 my-24 md:my-36 mx-auto relative px-3 md:px-6 max-w-[90rem]">
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`flex flex-col gap-8 md:gap-12 w-full px-4 md:px-12 py-6 md:py-16 ${
          !isDarkMode && 'border border-[#d9d9d9]'
        }`}
      >
        {/* Header Section */}
        <div className="w-full flex flex-col gap-4 text-left">
          <h1 className={`${isMobile ? 'text-xl' : 'text-3xl md:text-4xl'} font-normal`}>Manage or Add Liquidity</h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl">
            Navigate the dashboard to view and manage your positions, locks, and claim all your rewards.
          </p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {dashboardCards.map(card => (
            <DashboardCard
              key={card.id}
              title={card.title}
              description={card.description}
              isActive={card.isActive}
              onClick={card.onClick}
              variant={isDarkMode ? 'neutral' : 'primary'}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
