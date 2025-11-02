'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components';
import { REFETCH_INTERVALS, Themes } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import PositionsHero from '@/ui/liquidity/PositionsHero';
import PositionFilters from '@/ui/liquidity/PositionFilters';
import SearchBar from '@/ui/liquidity/SearchBar';
import PositionTable from '@/ui/liquidity/PositionTable';
import useQLAccountInfo from '@/hooks/useQLAccountInfo';
import { calculatePositionPercentage, mapGQLUserLiquidityPositions } from '@/lib/client/utils';
import { LiquidityPosition } from '@/gql/codegen/graphql';
import { useAssetList } from '@/context/assets';

// Mock position data for the user

const LiquidityPositionsPage = () => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState<'all' | 'concentrated' | 'stable' | 'volatile'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Asset list
  const assets = useAssetList();

  // Function to find asset
  const lookupAsset = useCallback(
    (id?: string) => {
      return assets.find(asset => asset.address.toLowerCase() === id?.toLowerCase());
    },
    [assets],
  );

  const accountInfo = useQLAccountInfo(REFETCH_INTERVALS);
  const qlPositions = useMemo(
    () => mapGQLUserLiquidityPositions((accountInfo?.lpPositions || []) as LiquidityPosition[], lookupAsset),
    [accountInfo?.lpPositions, lookupAsset],
  );

  const [userTVLUSD, userFeeUSD] = useMemo(() => {
    if (!accountInfo) return [0, 0];
    return accountInfo.lpPositions.reduce<[number, number]>(
      (previousValue, currentValue) => {
        const positionPercentage = calculatePositionPercentage(currentValue.position, currentValue.pool.totalSupply);
        const depositedUSD = positionPercentage * parseFloat(currentValue.pool.reserveUSD);
        const feeUSD = positionPercentage * parseFloat(currentValue.pool.totalFeesUSD);
        return [previousValue[0] + depositedUSD, previousValue[1] + feeUSD];
      },
      [0, 0],
    );
  }, [accountInfo]);

  // Filter positions based on active filter and search query
  const filteredPositions = useMemo(() => {
    return qlPositions.filter(position => {
      const matchesFilter = activeFilter === 'all' || position.type === activeFilter;
      const matchesSearch =
        position.token0.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        position.token1.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${position.token0.symbol}/${position.token1.symbol}`.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, qlPositions, searchQuery]);

  const handleNewDeposit = () => {
    router.push('/liquidity/deposit');
  };

  const handleWithdraw = (positionId: string) => {
    console.log('Withdraw position:', positionId);
  };

  const handleStake = (positionId: string) => {
    console.log('Stake position:', positionId);
  };

  const handleUnstake = (positionId: string) => {
    console.log('Unstake position:', positionId);
  };

  const handleCreatePool = (poolType: string) => {
    console.log('Create pool:', poolType);
  };

  return (
    <div className="flex w-full flex-1 justify-center items-start flex-col gap-8 py-6 md:py-12 my-24 md:my-36 mx-auto relative px-3 md:px-6 max-w-[90rem]">
      {/* Hero Section */}
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`flex flex-col w-full px-4 md:px-6 py-6 md:py-8 ${!isDarkMode && 'border border-[#d9d9d9]'}`}
      >
        <PositionsHero
          totalPositions={accountInfo?.lpPositions.length || 0}
          tvl={userTVLUSD}
          fees={userFeeUSD}
          onNewDepositClick={handleNewDeposit}
        />
      </Card>

      {/* Positions Title */}
      <h2 className="text-2xl md:text-3xl font-bold">Your Liquidity Positions</h2>

      {/* Filters and Search Section */}
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`flex flex-col w-full px-4 md:px-6 py-4 md:py-5 ${!isDarkMode && 'border border-[#d9d9d9]'}`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full">
          <PositionFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onCreatePool={handleCreatePool}
          />
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>
      </Card>

      {/* Table Section */}
      <div className="w-full flex flex-col gap-6">
        <PositionTable
          positions={filteredPositions}
          onWithdraw={handleWithdraw}
          onStake={handleStake}
          onUnstake={handleUnstake}
        />
      </div>
    </div>
  );
};

export default LiquidityPositionsPage;
