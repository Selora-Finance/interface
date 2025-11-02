'use client';

import { useAssetList } from '@/context/assets';
import AssetListModal from '@/ui/AssetListModal';
import ConcentratedLiquidityView from '@/ui/liquidity/ConcentratedLiquidityView';
import CLRangeView from '@/ui/liquidity/CLRangeView';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatUnits, getAddress, parseUnits, zeroAddress } from 'viem';
import { useRouter, useSearchParams } from 'next/navigation';
import { Settings, ArrowLeft } from 'lucide-react';
import { useWindowDimensions } from '@/hooks/utils';
import {
  BI_ZERO,
  ETHER,
  EXPLORERS,
  LARGE_BASE_POINT,
  MAX_SCREEN_SIZES,
  NFPM,
  REFETCH_INTERVALS,
  V3_SQRT_PRICE_BASIS,
} from '@/constants';
import SettingsModal from '@/ui/SettingsModal';
import { ConcentratedLiquidityQuerySchema, ConcentratedLiquidityQueryType } from '../__schema__';
import useV3PoolSlot from '@/hooks/useV3PoolSlot';
import useV3Pool from '@/hooks/useV3Pool';
import useQLPoolInfo from '@/hooks/useQLPoolInfo';
import { getTickFromPrice, normalizeSqrtPriceX96 } from '@/math';
import { useChainId } from 'wagmi';
import useApproveSpend from '@/hooks/useApproveSpend';
import useGetAllowance from '@/hooks/useGetAllowance';
import useAddLiquidityV3 from '@/hooks/liquidity/useAddLiquidityV3';
import useIncreaseLiquidityV3 from '@/hooks/liquidity/useIncreaseLiquidityV3';
import TransactionErrorModal from '@/ui/TransactionErrorModal';
import TransactionSuccessModal from '@/ui/TransactionSuccessModal';
import useGetBalance from '@/hooks/useGetBalance';

type RangePreset = 'passive' | 'wide' | 'narrow' | 'aggressive' | 'intense';

export default function ConcentratedLiquidity() {
  const router = useRouter();

  const searchParams = useSearchParams();

  // Query params
  const queryParams = useMemo(() => {
    const { data, error } = ConcentratedLiquidityQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));
    if (error && !data)
      return {
        token0: zeroAddress,
        token1: zeroAddress,
        tickSpacing: 100,
        tokenId: BI_ZERO,
      } as ConcentratedLiquidityQueryType;
    return data;
  }, [searchParams]);

  const [address0, setAddress0] = useState<Address>(zeroAddress);
  const [address1, setAddress1] = useState<Address>(zeroAddress);

  const [showModal0, setShowModal0] = useState<boolean>(false);
  const [showModal1, setShowModal1] = useState<boolean>(false);

  // Transaction modals parameters
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [transactionPreviewUrl, setTransactionPreviewUrl] = useState<string>('');

  const [feeTier, setFeeTier] = useState<string>('0.25');
  const [rangeType, setRangeType] = useState<'preset' | 'custom'>('preset');
  const [rangePreset, setRangePreset] = useState<RangePreset>('passive');
  const [amount0, setAmount0] = useState<string>('');
  const [amount1, setAmount1] = useState<string>('');
  const [tokenId, setTokenId] = useState<bigint>(BI_ZERO);
  const feeTierParsed = useMemo(() => parseFloat(feeTier) * LARGE_BASE_POINT, [feeTier]);

  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Handle range type change and initialize custom prices
  const handleRangeTypeChange = (type: 'preset' | 'custom') => {
    setRangeType(type);
    if (type === 'custom') {
      // Initialize custom prices with current preset values
      const presetRanges = {
        passive: 0.5,
        wide: 0.35,
        narrow: 0.08,
        aggressive: 0.01,
        intense: 0.006,
      };
      const range = presetRanges[rangePreset] || 0.5;
      setCustomMinPrice(currentPrice * (1 - range));
      setCustomMaxPrice(currentPrice * (1 + range));
    } else {
      // Reset custom prices when switching to preset
      setCustomMinPrice(null);
      setCustomMaxPrice(null);
    }
  };

  const handleQueryParamsChange = useCallback(() => {
    if (queryParams.token0) setAddress0(queryParams.token0 as Address);
    if (queryParams.token1) setAddress1(queryParams.token1 as Address);
    if (queryParams.tickSpacing) setFeeTier(String(queryParams.tickSpacing / LARGE_BASE_POINT));
    if (queryParams.tokenId) setTokenId(queryParams.tokenId);
  }, [queryParams.tickSpacing, queryParams.token0, queryParams.token1, queryParams.tokenId]);

  // Assets list
  const assets = useAssetList();
  const [asset0, asset1] = useMemo(() => {
    return [
      assets.find(asset => asset.address.toLowerCase() === address0.toLowerCase()),
      assets.find(asset => asset.address.toLowerCase() === address1.toLowerCase()),
    ];
  }, [assets, address0, address1]);

  const [currentPrice, setCurrentPrice] = useState<number>(0); // Mock current price

  // State for custom price range (can be adjusted by dragging)
  const [customMinPrice, setCustomMinPrice] = useState<number | null>(null);
  const [customMaxPrice, setCustomMaxPrice] = useState<number | null>(null);

  // Calculate min/max price based on preset or custom values
  const { minPrice, maxPrice } = useMemo(() => {
    // If custom values are set, use them
    if (customMinPrice !== null && customMaxPrice !== null) {
      return {
        minPrice: customMinPrice,
        maxPrice: customMaxPrice,
      };
    }

    // Otherwise calculate from preset
    const presetRanges = {
      passive: 0.5, // +/- 50%
      wide: 0.35, // +/- 35%
      narrow: 0.08, // +/- 8%
      aggressive: 0.01, // +/- 1%
      intense: 0.006, // +/- 0.6%
    };

    const range = presetRanges[rangePreset] || 0.5;
    return {
      minPrice: currentPrice * (1 - range),
      maxPrice: currentPrice * (1 + range),
    };
  }, [rangePreset, currentPrice, customMinPrice, customMaxPrice]);

  // Parsed amounts
  const [amount0Parsed, amount1Parsed] = useMemo(
    () => [parseUnits(amount0, asset0?.decimals || 18), parseUnits(amount1, asset1?.decimals || 18)],
    [amount0, amount1, asset0?.decimals, asset1?.decimals],
  );

  // Handle range change from dragging
  const handleRangeChange = (min: number, max: number) => {
    setCustomMinPrice(min);
    setCustomMaxPrice(max);
  };

  // Reset custom prices when preset changes
  const handleRangePresetChange = (preset: RangePreset) => {
    setRangePreset(preset);
    setCustomMinPrice(null);
    setCustomMaxPrice(null);
  };

  const handleBackClick = () => {
    router.push('/liquidity/deposit');
  };

  const handleSwitchToStandard = () => {
    router.push('/liquidity/deposit/standard');
  };

  const handleSwitchClick = useCallback(() => {
    const temp0 = address0;
    const temp1 = address1;
    setAddress0(temp1);
    setAddress1(temp0);
  }, [address0, address1]);

  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  const pool = useV3Pool(address0, address1, parseFloat(feeTier) * LARGE_BASE_POINT, REFETCH_INTERVALS);
  const [sqrtPriceInBasis] = useV3PoolSlot(address0, address1, parseFloat(feeTier) * LARGE_BASE_POINT);
  const poolInfo = useQLPoolInfo(pool, REFETCH_INTERVALS);

  // SQRTPrice from current price
  const newSQRTPrice = useMemo(() => {
    if ((sqrtPriceInBasis === BI_ZERO || pool === zeroAddress) && asset0 && asset1) {
      const sqrtPrice =
        Math.sqrt(currentPrice * Math.pow(10, asset1.decimals - asset0.decimals)) * Number(V3_SQRT_PRICE_BASIS);
      return BigInt(sqrtPrice);
    }
    return BI_ZERO;
  }, [asset0, asset1, currentPrice, pool, sqrtPriceInBasis]);

  const handleSQRTPriceBasisChange = useCallback(() => {
    if (sqrtPriceInBasis > BI_ZERO && poolInfo) {
      const termsOfSecondToken = poolInfo.token0.id.toLowerCase() === address0.toLowerCase();
      const normalizedPrice = normalizeSqrtPriceX96(
        sqrtPriceInBasis,
        poolInfo.token0.decimals,
        poolInfo.token1.decimals,
        termsOfSecondToken,
      );
      setCurrentPrice(normalizedPrice);
    }
  }, [address0, poolInfo, sqrtPriceInBasis, setCurrentPrice]);

  const chainId = useChainId();
  const positionCreator = useMemo(() => NFPM[chainId], [chainId]);

  // Allowances
  const token0RouterAllowance = useGetAllowance(address0, positionCreator, REFETCH_INTERVALS);
  const token1RouterAllowance = useGetAllowance(address1, positionCreator, REFETCH_INTERVALS);

  // Approvals
  const token0RouterApproval = useApproveSpend(address0, positionCreator, amount0Parsed);
  const token1RouterApproval = useApproveSpend(address1, positionCreator, amount1Parsed);

  // Add liquidity
  const addLiquidity = useAddLiquidityV3(
    address0,
    address1,
    feeTierParsed,
    getTickFromPrice(minPrice, feeTierParsed),
    getTickFromPrice(maxPrice, feeTierParsed),
    amount0Parsed,
    amount1Parsed,
    newSQRTPrice,
    hash => {
      setTransactionPreviewUrl(`${EXPLORERS[chainId]}/tx/${hash}`);
      setShowSuccess(true);
    },
    () => setShowError(true),
  );

  // Increase liquidity
  const increaseLiquidity = useIncreaseLiquidityV3(
    tokenId,
    amount0Parsed,
    amount1Parsed,
    address0.toLowerCase() === ETHER.toLowerCase()
      ? '0'
      : address1.toLowerCase() === ETHER.toLowerCase()
      ? '1'
      : undefined,
    hash => {
      setTransactionPreviewUrl(`${EXPLORERS[chainId]}/tx/${hash}`);
      setShowSuccess(true);
    },
    () => setShowError(true),
  );

  const initiateTransaction = useCallback(() => {
    if (token0RouterAllowance < amount0Parsed) {
      token0RouterApproval.reset();
      return token0RouterApproval.execute();
    }
    if (token1RouterAllowance < amount1Parsed) {
      token1RouterApproval.reset();
      return token1RouterApproval.execute();
    }

    if (tokenId !== BI_ZERO) {
      increaseLiquidity.reset();
      return increaseLiquidity.execute();
    }

    addLiquidity.reset();
    return addLiquidity.execute();
  }, [
    addLiquidity,
    amount0Parsed,
    amount1Parsed,
    increaseLiquidity,
    token0RouterAllowance,
    token0RouterApproval,
    token1RouterAllowance,
    token1RouterApproval,
    tokenId,
  ]);

  // Balances
  const token0Balance = useGetBalance(address0, REFETCH_INTERVALS);
  const token1Balance = useGetBalance(address1, REFETCH_INTERVALS);

  useEffect(() => handleQueryParamsChange(), [handleQueryParamsChange]);
  useEffect(() => handleSQRTPriceBasisChange(), [handleSQRTPriceBasisChange]);

  return (
    <>
      <div className="flex w-svw flex-1 justify-center items-start flex-col gap-6 py-6 md:py-12 my-36 mx-auto relative px-3 max-w-[90rem]">
        {/* Title with Settings */}
        <div className="flex justify-between items-center w-full">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>Concentrated Liquidity</h2>
          <button
            onClick={() => setShowSettings(true)}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Back and Switch to Standard */}
        <div className="flex justify-between items-center w-full">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            onClick={handleSwitchToStandard}
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            Switch to Standard
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="flex w-full flex-col md:flex-row gap-4 md:gap-6 items-start justify-between">
          <ConcentratedLiquidityView
            asset0={asset0}
            asset1={asset1}
            token0Balance={formatUnits(token0Balance, asset0?.decimals ?? 18)}
            token1Balance={formatUnits(token1Balance, asset1?.decimals ?? 18)}
            onSelector0Click={() => setShowModal0(true)}
            onSelector1Click={() => setShowModal1(true)}
            feeTier={feeTier}
            onFeeTierChange={setFeeTier}
            rangeType={rangeType}
            onRangeTypeChange={handleRangeTypeChange}
            rangePreset={rangePreset}
            onRangePresetChange={handleRangePresetChange}
            amount0={amount0}
            amount1={amount1}
            onAmount0Change={setAmount0}
            onAmount1Change={setAmount1}
            currentPrice={currentPrice}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setCustomMinPrice}
            onMaxPriceChange={setCustomMaxPrice}
            onCurrentPriceChange={setCurrentPrice}
            onSwitchClick={handleSwitchClick}
            disableCurrentPriceEdit={sqrtPriceInBasis > BI_ZERO}
            isLiquidityIncrease={tokenId !== BI_ZERO}
            needsApproval={token0RouterAllowance < amount0Parsed || token1RouterAllowance < amount1Parsed}
            asset0NeedsApproval={token0RouterAllowance < amount0Parsed}
            isLoading={token0RouterApproval.isLoading || token1RouterApproval.isLoading || addLiquidity.isLoading}
            onInitiateButtonClick={initiateTransaction}
          />
          <CLRangeView
            asset0={asset0}
            asset1={asset1}
            minPrice={minPrice}
            maxPrice={maxPrice}
            currentPrice={currentPrice}
            amount0={amount0}
            amount1={amount1}
            feeTier={feeTier}
            onRangeChange={handleRangeChange}
          />
        </div>
      </div>
      <AssetListModal
        isOpen={showModal0}
        selectedAssets={new Set([address0, address1])}
        onAssetSelect={asset => {
          setAddress0(getAddress(asset));
          setShowModal0(false);
        }}
        onClose={() => setShowModal0(false)}
      />
      <AssetListModal
        isOpen={showModal1}
        selectedAssets={new Set([address0, address1])}
        onAssetSelect={asset => {
          setAddress1(getAddress(asset));
          setShowModal1(false);
        }}
        onClose={() => setShowModal1(false)}
      />
      <TransactionSuccessModal
        title="Add Liquidity"
        onHide={() => {
          setShowSuccess(false);
          token0RouterApproval.reset();
          token1RouterApproval.reset();
          addLiquidity.reset();
        }}
        show={showSuccess}
        transactionPreviewUrl={transactionPreviewUrl}
      />
      <TransactionErrorModal
        title="Add Liquidity"
        onHide={() => {
          token0RouterApproval.reset();
          token1RouterApproval.reset();
          addLiquidity.reset();
          setShowError(false);
        }}
        show={showError}
      />
      <SettingsModal show={showSettings} onHide={() => setShowSettings(false)} />
    </>
  );
}
