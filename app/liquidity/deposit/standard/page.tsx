'use client';

import { useAssetList } from '@/context/assets';
import AssetListModal from '@/ui/AssetListModal';
import StandardLiquidityView from '@/ui/liquidity/StandardLiquidityView';
import StandardLiquidityDetails from '@/ui/liquidity/StandardLiquidityDetails';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatUnits, getAddress, parseUnits, zeroAddress } from 'viem';
import { useRouter, useSearchParams } from 'next/navigation';
import useV2QuoteAddLiquidity from '@/hooks/useV2QuoteAddLiquidity';
import { StandardLiquidityQuerySchema, StandardLiquidityQueryType } from '../__schema__';
import SettingsModal from '@/ui/SettingsModal';
import { BI_ZERO, EXPLORERS, REFETCH_INTERVALS, V2_ROUTERS } from '@/constants';
import { useChainId } from 'wagmi';
import useGetAllowance from '@/hooks/useGetAllowance';
import useApproveSpend from '@/hooks/useApproveSpend';
import useAddLiquidityV2 from '@/hooks/liquidity/useAddLiquidityV2';
import TransactionSuccessModal from '@/ui/TransactionSuccessModal';
import TransactionErrorModal from '@/ui/TransactionErrorModal';
import useGetBalance from '@/hooks/useGetBalance';
import useMarketValueUSD from '@/hooks/useMarketValueUSD';

type PoolType = 'volatile' | 'stable';

export default function StandardLiquidity() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Query params
  const queryParams = useMemo(() => {
    const { data, error } = StandardLiquidityQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));
    if (error && !data)
      return {
        token0: zeroAddress,
        token1: zeroAddress,
        poolType: 'volatile',
      } as StandardLiquidityQueryType;
    return data;
  }, [searchParams]);

  const [address0, setAddress0] = useState<Address>(getAddress(queryParams.token0));
  const [address1, setAddress1] = useState<Address>(getAddress(queryParams.token1));

  const [showModal0, setShowModal0] = useState<boolean>(false);
  const [showModal1, setShowModal1] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Transaction modals parameters
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [transactionPreviewUrl, setTransactionPreviewUrl] = useState<string>('');

  const [poolType, setPoolType] = useState<PoolType>(queryParams.poolType);
  const [amount0, setAmount0] = useState<string>('');
  const [amount1, setAmount1] = useState<string>('');

  const handleQueryParamsChange = useCallback(() => {
    if (queryParams.token0) setAddress0(queryParams.token0 as Address);
    if (queryParams.token1) setAddress1(queryParams.token1 as Address);
    if (queryParams.poolType) setPoolType(queryParams.poolType);
  }, [queryParams.poolType, queryParams.token0, queryParams.token1]);

  // Assets list
  const assets = useAssetList();
  const [asset0, asset1] = useMemo(() => {
    return [assets.find(asset => asset.address === address0), assets.find(asset => asset.address === address1)];
  }, [assets, address0, address1]);

  const handleBackClick = () => {
    router.push('/liquidity/deposit');
  };

  const handleSwitchToConcentrated = () => {
    router.push('/liquidity/deposit/concentrated');
  };

  // Parsed amounts
  const [amount0Parsed, amount1Parsed] = useMemo(
    () => [parseUnits(amount0, asset0?.decimals || 18), parseUnits(amount1, asset1?.decimals || 18)],
    [amount0, amount1, asset0?.decimals, asset1?.decimals],
  );

  // Quote add liquidity
  const { data: quoteLiquidityData } = useV2QuoteAddLiquidity(
    address0,
    address1,
    poolType === 'stable',
    amount0Parsed,
    amount1Parsed,
  );

  const currentQuote = useMemo(() => {
    if (poolType === 'stable') return 1;
    const [amountA, amountB] = quoteLiquidityData;
    if (amountA === BI_ZERO || amountB === BI_ZERO) return 0;
    const _amountA = parseFloat(formatUnits(amountA, asset0?.decimals ?? 18));
    const _amountB = parseFloat(formatUnits(amountB, asset1?.decimals ?? 18));
    return _amountB / _amountA;
  }, [asset0?.decimals, asset1?.decimals, poolType, quoteLiquidityData]);

  const chainId = useChainId();
  const v2Router = useMemo(() => V2_ROUTERS[chainId], [chainId]);

  // Allowances
  const token0RouterAllowance = useGetAllowance(address0, v2Router, REFETCH_INTERVALS);
  const token1RouterAllowance = useGetAllowance(address0, v2Router, REFETCH_INTERVALS);

  // Approvals
  const token0RouterApproval = useApproveSpend(
    address0,
    v2Router,
    amount0Parsed,
    hash => {
      setTransactionPreviewUrl(`${EXPLORERS[chainId]}/tx/${hash}`);
      setShowSuccess(true);
    },
    () => setShowError(true),
  );
  const token1RouterApproval = useApproveSpend(
    address0,
    v2Router,
    amount1Parsed,
    hash => {
      setTransactionPreviewUrl(`${EXPLORERS[chainId]}/tx/${hash}`);
      setShowSuccess(true);
    },
    () => setShowError(true),
  );

  // Add liquidity
  const addLiquidity = useAddLiquidityV2(
    address0,
    address1,
    poolType === 'stable',
    amount0Parsed,
    amount1Parsed,
    hash => {
      setTransactionPreviewUrl(`${EXPLORERS[chainId]}/tx/${hash}`);
      setShowSuccess(true);
    },
    () => setShowError(true),
  );

  // Initiate transaction
  const initiateTransaction = useCallback(() => {
    if (token0RouterAllowance < amount0Parsed) return token0RouterApproval.execute();
    if (token1RouterAllowance < amount1Parsed) return token1RouterApproval.execute();
    return addLiquidity.execute();
  }, [
    addLiquidity,
    amount0Parsed,
    amount1Parsed,
    token0RouterAllowance,
    token0RouterApproval,
    token1RouterAllowance,
    token1RouterApproval,
  ]);

  // Balances
  const token0Balance = useGetBalance(address0, REFETCH_INTERVALS);
  const token1Balance = useGetBalance(address1, REFETCH_INTERVALS);

  // Market value
  const [token0BalanceUSD] = useMarketValueUSD(address0, token0Balance, REFETCH_INTERVALS);
  const [token1BalanceUSD] = useMarketValueUSD(address1, token1Balance, REFETCH_INTERVALS);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => handleQueryParamsChange(), [handleQueryParamsChange]);
  useEffect(() => {
    token0RouterApproval.reset();
    token1RouterApproval.reset();
    addLiquidity.reset();
  }, [addLiquidity, token0RouterApproval, token1RouterApproval, transactionPreviewUrl]);

  return (
    <>
      <div className="flex w-svw flex-1 justify-center items-center flex-col gap-4 py-6 md:py-12 my-36 mx-auto relative px-3">
        <StandardLiquidityView
          asset0={asset0}
          asset1={asset1}
          token0Balance={formatUnits(token0Balance, asset0?.decimals ?? 18)}
          token1Balance={formatUnits(token1Balance, asset1?.decimals ?? 18)}
          token0BalanceUSD={formatUnits(token0BalanceUSD, 18)}
          token1BalanceUSD={formatUnits(token1BalanceUSD, 18)}
          onSelector0Click={() => setShowModal0(true)}
          onSelector1Click={() => setShowModal1(true)}
          onBackClick={handleBackClick}
          onSwitchToConcentrated={handleSwitchToConcentrated}
          onSettingsClick={() => setShowSettings(true)}
          poolType={poolType}
          onPoolTypeChange={setPoolType}
          amount0={amount0}
          amount1={amount1}
          onAmount0Change={setAmount0}
          onAmount1Change={setAmount1}
          currentQuote={currentQuote}
          needsApproval={token0RouterAllowance < amount0Parsed || token1RouterAllowance < amount1Parsed}
          asset0NeedsApproval={token0RouterAllowance < amount0Parsed}
          isLoading={token0RouterApproval.isLoading || token1RouterApproval.isLoading || addLiquidity.isLoading}
          onInitiateButtonClick={initiateTransaction}
        />
        <StandardLiquidityDetails
          asset0={asset0}
          asset1={asset1}
          amount0={amount0}
          amount1={amount1}
          poolType={poolType}
        />
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
      <SettingsModal show={showSettings} onHide={() => setShowSettings(false)} />
      <TransactionSuccessModal
        title="Add Liquidity"
        onHide={() => setShowSuccess(false)}
        show={showSuccess}
        transactionPreviewUrl={transactionPreviewUrl}
      />
      <TransactionErrorModal title="Add Liquidity" onHide={() => setShowError(false)} show={showError} />
    </>
  );
}
