'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components';
import { Themes } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import PositionsHero from '@/ui/liquidity/PositionsHero';
import PositionFilters from '@/ui/liquidity/PositionFilters';
import SearchBar from '@/ui/liquidity/SearchBar';
import PositionTable from '@/ui/liquidity/PositionTable';
import { PositionData } from '@/typings';

// Mock position data for the user
const MOCK_POSITIONS: PositionData[] = [
  {
    id: '1',
    token0: {
      symbol: 'ETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '3.52',
    },
    token1: {
      symbol: 'CEDA',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '19,366.48',
    },
    tvl: '~$276,271.17',
    apr: '38.06%',
    yourDeposit: '~$9.14K',
    staked: '~$9.14K',
    feeRate: '0.3%',
    type: 'volatile',
    hasPoints: true,
    pointsText: '10x Points + veCEDA',
    poolTvl: {
      token0: '79.0',
      token1: '88,888.65',
    },
  },
  {
    id: '2',
    token0: {
      symbol: 'bcUSD',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '3.52',
    },
    token1: {
      symbol: 'CEDA',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '19,366.48',
    },
    tvl: '~$276,271.17',
    apr: '38.06%',
    yourDeposit: '~$9.14K',
    staked: '~$9.14K',
    feeRate: '0.3%',
    type: 'concentrated',
    hasPoints: true,
    pointsText: '10x Points + veCEDA',
    poolTvl: {
      token0: '79.0',
      token1: '88,888.65',
    },
  },
];

const LiquidityPositionsPage = () => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState<'all' | 'concentrated' | 'stable' | 'volatile'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter positions based on active filter and search query
  const filteredPositions = useMemo(() => {
    return MOCK_POSITIONS.filter(position => {
      const matchesFilter = activeFilter === 'all' || position.type === activeFilter;
      const matchesSearch =
        position.token0.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        position.token1.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${position.token0.symbol}/${position.token1.symbol}`.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

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
        <PositionsHero totalPositions={MOCK_POSITIONS.length} onNewDepositClick={handleNewDeposit} />
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
