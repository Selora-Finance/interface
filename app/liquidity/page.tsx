'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LiquidityHero from '@/ui/liquidity/LiquidityHero';
import PoolFilters from '@/ui/liquidity/PoolFilters';
import SearchBar from '@/ui/liquidity/SearchBar';
import PoolTable from '@/ui/liquidity/PoolTable';
import { Card, Pagination } from '@/components';
import { Themes } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import useStats from '@/hooks/useStats';
import useAllPools from '@/hooks/useAllPools';
import { mapGQLPool } from '@/lib/client/utils';
import { useAssetList } from '@/context/assets';
import { Pool } from '@/gql/codegen/graphql';

type PoolType = 'concentrated' | 'stable' | 'volatile';

export default function Liquidity() {
  const router = useRouter();
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const [activeFilter, setActiveFilter] = useState<PoolType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  //Assets list
  const assets = useAssetList();

  // Stats (fetched every minute)
  const stats = useStats(60000);
  // Pools (from subgraph, fetched every minute)
  const qlPools = useAllPools(0, 1000, 60000);

  // Function to find asset
  const lookupAsset = useCallback(
    (id?: string) => {
      return assets.find(asset => asset.address.toLowerCase() === id?.toLowerCase());
    },
    [assets],
  );

  // Mapped pools (mapped to PoolData)
  const mappedPools = useMemo(() => mapGQLPool(qlPools as Pool[], lookupAsset), [lookupAsset, qlPools]);

  const filteredPools = useMemo(() => {
    let filtered = mappedPools;

    // Filter by type
    if (activeFilter !== 'all') {
      filtered = filtered.filter(pool => pool.type === activeFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        pool =>
          pool.token0.symbol.toLowerCase().includes(query) ||
          pool.token1.symbol.toLowerCase().includes(query) ||
          pool.id.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [activeFilter, mappedPools, searchQuery]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPools.length / ITEMS_PER_PAGE);
  const paginatedPools = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPools.slice(startIndex, endIndex);
  }, [filteredPools, currentPage]);

  const handleDeposit = useCallback(
    (poolId: string) => {
      const matchingPool = mappedPools.find(pool => pool.id.toLowerCase() === poolId.toLowerCase());
      if (!matchingPool) return;

      if (matchingPool.type !== 'concentrated') {
        router.push(
          `/liquidity/deposit/standard?token0=${matchingPool.token0.id}&token1=${matchingPool.token1.id}&poolType=${matchingPool.type}`,
        );
      }
    },
    [mappedPools, router],
  );

  const handleDepositLiquidity = () => {
    router.push('/liquidity/deposit');
  };

  const handleCreatePool = (type: PoolType) => {
    console.log('Create pool of type:', type);
    router.push('/liquidity/deposit');
  };

  return (
    <div className="flex w-full flex-1 justify-center items-start flex-col gap-8 py-6 md:py-12 my-24 md:my-36 mx-auto relative px-3 md:px-6 max-w-[90rem]">
      {/* Hero Section */}
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`flex flex-col w-full px-4 md:px-6 py-6 md:py-8 ${!isDarkMode && 'border border-[#d9d9d9]'}`}
      >
        <LiquidityHero
          totalPools={stats?.totalPairsCreated}
          tvl={stats?.totalVolumeLockedUSD}
          fees={stats?.totalFeesUSD}
          volume={stats?.totalTradeVolumeUSD}
          onDepositClick={handleDepositLiquidity}
        />
      </Card>

      {/* Pools Title */}
      <h2 className="text-2xl md:text-3xl font-bold">Liquidity Pools</h2>

      {/* Filters and Search Section */}
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`flex flex-col w-full px-4 md:px-6 py-4 md:py-5 ${!isDarkMode && 'border border-[#d9d9d9]'}`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full">
          <PoolFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} onCreatePool={handleCreatePool} />
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>
      </Card>

      {/* Table Section - Transparent Container */}
      <div className="w-full flex flex-col gap-4">
        <PoolTable pools={paginatedPools} onDeposit={handleDeposit} />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            variant={isDarkMode ? 'neutral' : 'primary'}
          />
        )}
      </div>
    </div>
  );
}
