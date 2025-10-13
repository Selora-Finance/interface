'use client';

import { PoolData } from '@/typings';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import LiquidityHero from '@/ui/liquidity/LiquidityHero';
import PoolFilters from '@/ui/liquidity/PoolFilters';
import SearchBar from '@/ui/liquidity/SearchBar';
import PoolTable from '@/ui/liquidity/PoolTable';
import { Card, Pagination } from '@/components';
import { Themes } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';

// Mock pool data matching the design
const MOCK_POOLS: PoolData[] = [
  {
    id: '1',
    token0: {
      symbol: 'ETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '70.0',
    },
    token1: {
      symbol: 'TEOS',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '0.0013',
    },
    tvl: '~$16.60M',
    volume: '+$270,271.17',
    fees: '+$270.17',
    apr: '38.00% + Points',
    feeRate: '0.3%',
    type: 'volatile',
    hasPoints: true,
    pointsText: '10x Points + voTEOS',
    feeAmounts: {
      token0: '0.21',
      token1: '0.000001',
    },
    reserves: {
      token0: '8,420.5',
      token1: '1.98',
    },
  },
  {
    id: '2',
    token0: {
      symbol: 'WBTC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
      amount: '45.2',
    },
    token1: {
      symbol: 'ETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '892.5',
    },
    tvl: '~$12.4M',
    volume: '+$185,420.50',
    fees: '+$185.42',
    apr: '35.50%',
    feeRate: '0.3%',
    type: 'volatile',
    feeAmounts: {
      token0: '0.14',
      token1: '0.67',
    },
    reserves: {
      token0: '5,120.8',
      token1: '10,500.2',
    },
  },
  {
    id: '3',
    token0: {
      symbol: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '5.8M',
    },
    token1: {
      symbol: 'USDT',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      amount: '5.7M',
    },
    tvl: '~$11.5M',
    volume: '+$320,150.80',
    fees: '+$160.08',
    apr: '18.20%',
    feeRate: '0.05%',
    type: 'stable',
    feeAmounts: {
      token0: '0.08',
      token1: '0.08',
    },
    reserves: {
      token0: '8.2M',
      token1: '8.1M',
    },
  },
  {
    id: '4',
    token0: {
      symbol: 'DAI',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      amount: '3.2M',
    },
    token1: {
      symbol: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '3.2M',
    },
    tvl: '~$6.4M',
    volume: '+$142,680.25',
    fees: '+$71.34',
    apr: '15.80%',
    feeRate: '0.05%',
    type: 'stable',
    feeAmounts: {
      token0: '0.036',
      token1: '0.036',
    },
    reserves: {
      token0: '4.5M',
      token1: '4.5M',
    },
  },
  {
    id: '5',
    token0: {
      symbol: 'LINK',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
      amount: '285K',
    },
    token1: {
      symbol: 'ETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '1.2K',
    },
    tvl: '~$8.8M',
    volume: '+$98,750.40',
    fees: '+$296.25',
    apr: '42.30% + Points',
    feeRate: '0.3%',
    type: 'volatile',
    hasPoints: true,
    pointsText: '5x Points',
    feeAmounts: {
      token0: '0.30',
      token1: '0.0012',
    },
    reserves: {
      token0: '380K',
      token1: '1.58K',
    },
  },
  {
    id: '6',
    token0: {
      symbol: 'UNI',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
      amount: '425K',
    },
    token1: {
      symbol: 'ETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '980',
    },
    tvl: '~$5.2M',
    volume: '+$75,320.60',
    fees: '+$225.96',
    apr: '38.90%',
    feeRate: '0.3%',
    type: 'concentrated',
    feeAmounts: {
      token0: '0.23',
      token1: '0.00098',
    },
    reserves: {
      token0: '520K',
      token1: '1.2K',
    },
  },
  {
    id: '7',
    token0: {
      symbol: 'MATIC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png',
      amount: '8.5M',
    },
    token1: {
      symbol: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '4.8M',
    },
    tvl: '~$9.6M',
    volume: '+$112,450.30',
    fees: '+$337.35',
    apr: '46.20%',
    feeRate: '0.3%',
    type: 'volatile',
    feeAmounts: {
      token0: '0.34',
      token1: '0.19',
    },
    reserves: {
      token0: '10.2M',
      token1: '5.6M',
    },
  },
  {
    id: '8',
    token0: {
      symbol: 'AAVE',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png',
      amount: '52K',
    },
    token1: {
      symbol: 'ETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '750',
    },
    tvl: '~$4.1M',
    volume: '+$68,920.15',
    fees: '+$206.76',
    apr: '41.50% + Points',
    feeRate: '0.3%',
    type: 'concentrated',
    hasPoints: true,
    pointsText: '8x Points + voTEOS',
    feeAmounts: {
      token0: '0.21',
      token1: '0.00075',
    },
    reserves: {
      token0: '68K',
      token1: '950',
    },
  },
  {
    id: '9',
    token0: {
      symbol: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '2.8M',
    },
    token1: {
      symbol: 'DAI',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      amount: '2.8M',
    },
    tvl: '~$5.6M',
    volume: '+$95,230.45',
    fees: '+$47.62',
    apr: '12.50%',
    feeRate: '0.05%',
    type: 'stable',
    feeAmounts: {
      token0: '0.024',
      token1: '0.024',
    },
    reserves: {
      token0: '3.9M',
      token1: '3.9M',
    },
  },
  {
    id: '10',
    token0: {
      symbol: 'WETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '1.5K',
    },
    token1: {
      symbol: 'USDT',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      amount: '3.2M',
    },
    tvl: '~$6.4M',
    volume: '+$180,500.20',
    fees: '+$541.50',
    apr: '52.30%',
    feeRate: '0.3%',
    type: 'volatile',
    feeAmounts: {
      token0: '0.16',
      token1: '350',
    },
    reserves: {
      token0: '1.8K',
      token1: '3.8M',
    },
  },
  {
    id: '11',
    token0: {
      symbol: 'CRV',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png',
      amount: '850K',
    },
    token1: {
      symbol: 'ETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '420',
    },
    tvl: '~$3.1M',
    volume: '+$55,840.80',
    fees: '+$167.52',
    apr: '39.80%',
    feeRate: '0.3%',
    type: 'concentrated',
    feeAmounts: {
      token0: '256',
      token1: '0.05',
    },
    reserves: {
      token0: '1.1M',
      token1: '520',
    },
  },
  {
    id: '12',
    token0: {
      symbol: 'MKR',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png',
      amount: '18K',
    },
    token1: {
      symbol: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '2.4M',
    },
    tvl: '~$4.8M',
    volume: '+$62,350.70',
    fees: '+$187.05',
    apr: '44.60%',
    feeRate: '0.3%',
    type: 'volatile',
    feeAmounts: {
      token0: '5.4',
      token1: '62',
    },
    reserves: {
      token0: '22K',
      token1: '2.9M',
    },
  },
  {
    id: '13',
    token0: {
      symbol: 'COMP',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png',
      amount: '45K',
    },
    token1: {
      symbol: 'WETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '380',
    },
    tvl: '~$2.9M',
    volume: '+$48,720.30',
    fees: '+$146.16',
    apr: '36.40%',
    feeRate: '0.3%',
    type: 'concentrated',
    feeAmounts: {
      token0: '14.6',
      token1: '0.04',
    },
    reserves: {
      token0: '55K',
      token1: '460',
    },
  },
  {
    id: '14',
    token0: {
      symbol: 'SNX',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png',
      amount: '325K',
    },
    token1: {
      symbol: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '1.5M',
    },
    tvl: '~$3.0M',
    volume: '+$42,680.55',
    fees: '+$128.04',
    apr: '31.20%',
    feeRate: '0.3%',
    type: 'volatile',
    feeAmounts: {
      token0: '28.5',
      token1: '42.8',
    },
    reserves: {
      token0: '400K',
      token1: '1.8M',
    },
  },
  {
    id: '15',
    token0: {
      symbol: 'YFI',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e/logo.png',
      amount: '280',
    },
    token1: {
      symbol: 'WETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '520',
    },
    tvl: '~$3.5M',
    volume: '+$51,220.90',
    fees: '+$153.66',
    apr: '40.10%',
    feeRate: '0.3%',
    type: 'concentrated',
    feeAmounts: {
      token0: '0.084',
      token1: '0.046',
    },
    reserves: {
      token0: '350',
      token1: '640',
    },
  },
  {
    id: '16',
    token0: {
      symbol: 'BAL',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png',
      amount: '180K',
    },
    token1: {
      symbol: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '1.1M',
    },
    tvl: '~$2.2M',
    volume: '+$32,450.60',
    fees: '+$97.35',
    apr: '28.50%',
    feeRate: '0.3%',
    type: 'volatile',
    feeAmounts: {
      token0: '9.7',
      token1: '32.5',
    },
    reserves: {
      token0: '220K',
      token1: '1.3M',
    },
  },
  {
    id: '17',
    token0: {
      symbol: 'SUSHI',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png',
      amount: '420K',
    },
    token1: {
      symbol: 'WETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '290',
    },
    tvl: '~$2.1M',
    volume: '+$38,720.40',
    fees: '+$116.16',
    apr: '33.90%',
    feeRate: '0.3%',
    type: 'volatile',
    feeAmounts: {
      token0: '126',
      token1: '0.035',
    },
    reserves: {
      token0: '520K',
      token1: '350',
    },
  },
  {
    id: '18',
    token0: {
      symbol: 'FXS',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0/logo.png',
      amount: '250K',
    },
    token1: {
      symbol: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '980K',
    },
    tvl: '~$1.96M',
    volume: '+$29,850.75',
    fees: '+$89.55',
    apr: '26.70%',
    feeRate: '0.3%',
    type: 'stable',
    feeAmounts: {
      token0: '8.96',
      token1: '29.9',
    },
    reserves: {
      token0: '310K',
      token1: '1.2M',
    },
  },
  {
    id: '19',
    token0: {
      symbol: 'LDO',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32/logo.png',
      amount: '380K',
    },
    token1: {
      symbol: 'WETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '210',
    },
    tvl: '~$1.8M',
    volume: '+$26,540.30',
    fees: '+$79.62',
    apr: '29.80%',
    feeRate: '0.3%',
    type: 'concentrated',
    feeAmounts: {
      token0: '79.6',
      token1: '0.027',
    },
    reserves: {
      token0: '470K',
      token1: '260',
    },
  },
  {
    id: '20',
    token0: {
      symbol: 'FRAX',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x853d955aCEf822Db058eb8505911ED77F175b99e/logo.png',
      amount: '3.5M',
    },
    token1: {
      symbol: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '3.5M',
    },
    tvl: '~$7.0M',
    volume: '+$125,680.50',
    fees: '+$62.84',
    apr: '14.20%',
    feeRate: '0.05%',
    type: 'stable',
    feeAmounts: {
      token0: '0.031',
      token1: '0.031',
    },
    reserves: {
      token0: '4.8M',
      token1: '4.8M',
    },
  },
  {
    id: '21',
    token0: {
      symbol: 'RPL',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xD33526068D116cE69F19A9ee46F0bd304F21A51f/logo.png',
      amount: '125K',
    },
    token1: {
      symbol: 'ETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '180',
    },
    tvl: '~$1.5M',
    volume: '+$22,350.40',
    fees: '+$67.05',
    apr: '32.10%',
    feeRate: '0.3%',
    type: 'volatile',
    feeAmounts: {
      token0: '6.7',
      token1: '0.02',
    },
    reserves: {
      token0: '155K',
      token1: '220',
    },
  },
  {
    id: '22',
    token0: {
      symbol: 'CVX',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B/logo.png',
      amount: '280K',
    },
    token1: {
      symbol: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '850K',
    },
    tvl: '~$1.7M',
    volume: '+$25,480.60',
    fees: '+$76.44',
    apr: '27.60%',
    feeRate: '0.3%',
    type: 'concentrated',
    feeAmounts: {
      token0: '7.6',
      token1: '25.5',
    },
    reserves: {
      token0: '340K',
      token1: '1.0M',
    },
  },
  {
    id: '23',
    token0: {
      symbol: '1INCH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x111111111117dC0aa78b770fA6A738034120C302/logo.png',
      amount: '650K',
    },
    token1: {
      symbol: 'WETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '140',
    },
    tvl: '~$1.2M',
    volume: '+$18,920.30',
    fees: '+$56.76',
    apr: '24.80%',
    feeRate: '0.3%',
    type: 'volatile',
    feeAmounts: {
      token0: '19.5',
      token1: '0.017',
    },
    reserves: {
      token0: '800K',
      token1: '170',
    },
  },
  {
    id: '24',
    token0: {
      symbol: 'ENS',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72/logo.png',
      amount: '95K',
    },
    token1: {
      symbol: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '720K',
    },
    tvl: '~$1.44M',
    volume: '+$21,680.50',
    fees: '+$65.04',
    apr: '30.50%',
    feeRate: '0.3%',
    type: 'concentrated',
    feeAmounts: {
      token0: '4.3',
      token1: '21.7',
    },
    reserves: {
      token0: '118K',
      token1: '890K',
    },
  },
  {
    id: '25',
    token0: {
      symbol: 'GRT',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xc944E90C64B2c07662A292be6244BDf05Cda44a7/logo.png',
      amount: '1.8M',
    },
    token1: {
      symbol: 'WETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '95',
    },
    tvl: '~$980K',
    volume: '+$15,320.70',
    fees: '+$45.96',
    apr: '22.40%',
    feeRate: '0.3%',
    type: 'volatile',
    feeAmounts: {
      token0: '540',
      token1: '0.014',
    },
    reserves: {
      token0: '2.2M',
      token1: '120',
    },
  },
  {
    id: '26',
    token0: {
      symbol: 'APE',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x4d224452801ACEd8B2F0aebE155379bb5D594381/logo.png',
      amount: '320K',
    },
    token1: {
      symbol: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '620K',
    },
    tvl: '~$1.24M',
    volume: '+$19,540.80',
    fees: '+$58.62',
    apr: '28.90%',
    feeRate: '0.3%',
    type: 'volatile',
    feeAmounts: {
      token0: '19.5',
      token1: '19.6',
    },
    reserves: {
      token0: '390K',
      token1: '760K',
    },
  },
  {
    id: '27',
    token0: {
      symbol: 'SHIB',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png',
      amount: '45B',
    },
    token1: {
      symbol: 'WETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '85',
    },
    tvl: '~$850K',
    volume: '+$12,680.90',
    fees: '+$38.04',
    apr: '19.70%',
    feeRate: '0.3%',
    type: 'concentrated',
    feeAmounts: {
      token0: '1.3B',
      token1: '0.011',
    },
    reserves: {
      token0: '55B',
      token1: '105',
    },
  },
  {
    id: '28',
    token0: {
      symbol: 'PEPE',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6982508145454Ce325dDbE47a25d4ec3d2311933/logo.png',
      amount: '120T',
    },
    token1: {
      symbol: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '580K',
    },
    tvl: '~$1.16M',
    volume: '+$17,850.40',
    fees: '+$53.55',
    apr: '25.30%',
    feeRate: '0.3%',
    type: 'volatile',
    feeAmounts: {
      token0: '5.4T',
      token1: '17.9',
    },
    reserves: {
      token0: '150T',
      token1: '710K',
    },
  },
  {
    id: '29',
    token0: {
      symbol: 'ARB',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1/logo.png',
      amount: '850K',
    },
    token1: {
      symbol: 'WETH',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      amount: '72',
    },
    tvl: '~$720K',
    volume: '+$11,220.60',
    fees: '+$33.66',
    apr: '21.60%',
    feeRate: '0.3%',
    type: 'concentrated',
    feeAmounts: {
      token0: '33.7',
      token1: '0.010',
    },
    reserves: {
      token0: '1.05M',
      token1: '88',
    },
  },
  {
    id: '30',
    token0: {
      symbol: 'OP',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x4200000000000000000000000000000000000042/logo.png',
      amount: '520K',
    },
    token1: {
      symbol: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      amount: '480K',
    },
    tvl: '~$960K',
    volume: '+$14,680.30',
    fees: '+$44.04',
    apr: '23.50%',
    feeRate: '0.3%',
    type: 'volatile',
    feeAmounts: {
      token0: '14.7',
      token1: '14.7',
    },
    reserves: {
      token0: '640K',
      token1: '590K',
    },
  },
];

type PoolType = 'concentrated' | 'stable' | 'volatile';

export default function Liquidity() {
  const router = useRouter();
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const [activeFilter, setActiveFilter] = useState<PoolType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredPools = useMemo(() => {
    let filtered = MOCK_POOLS;

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
  }, [activeFilter, searchQuery]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPools.length / ITEMS_PER_PAGE);
  const paginatedPools = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPools.slice(startIndex, endIndex);
  }, [filteredPools, currentPage]);

  const handleDeposit = (poolId: string) => {
    console.log('Deposit to pool:', poolId);
    router.push('/liquidity/deposit');
  };

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
        <LiquidityHero totalPools={MOCK_POOLS.length} onDepositClick={handleDepositLiquidity} />
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
