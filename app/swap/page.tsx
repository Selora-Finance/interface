'use client';

import {
  AUTO_SWAP_EXECUTORS,
  BI_ZERO,
  EXPLORERS,
  REFETCH_INTERVALS,
  RouterType,
  V2_SWAP_EXECUTORS,
  V3_SWAP_EXECUTORS,
} from '@/constants';
import { useAssetList } from '@/context/assets';
import useAutoSwap from '@/hooks/swap/useAutoSwap';
import usePredictSwapMovement from '@/hooks/swap/usePredictSwapMovement';
import useV2Swap from '@/hooks/swap/useV2Swap';
import useV3Swap from '@/hooks/swap/useV3Swap';
import useApproveSpend from '@/hooks/useApproveSpend';
import useGetAllowance from '@/hooks/useGetAllowance';
import useGetBalance from '@/hooks/useGetBalance';
import useMarketValueUSD from '@/hooks/useMarketValueUSD';
import { applySlippage } from '@/lib/client/utils';
import { routerTypeAtom, slippageToleranceAtom } from '@/store';
import AssetListModal from '@/ui/AssetListModal';
import SettingsModal from '@/ui/SettingsModal';
import MainSwapView from '@/ui/swap/MainSwapView';
import SwapDetails from '@/ui/swap/SwapDetails';
import TransactionErrorModal from '@/ui/TransactionErrorModal';
import TransactionSuccessModal from '@/ui/TransactionSuccessModal';
import { useAtom } from 'jotai';
import { useCallback, useMemo, useState } from 'react';
import { Address, formatUnits, getAddress, parseUnits, zeroAddress } from 'viem';
import { useChainId } from 'wagmi';

export default function Swap() {
  const [address0, setAddress0] = useState<Address>(zeroAddress);
  const [address1, setAddress1] = useState<Address>(zeroAddress);

  // Assets list
  const assets = useAssetList();
  const [asset0, asset1] = useMemo(() => {
    return [assets.find(asset => asset.address === address0), assets.find(asset => asset.address === address1)];
  }, [assets, address0, address1]);

  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');

  const [showModal0, setShowModal0] = useState<boolean>(false);
  const [showModal1, setShowModal1] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  // Transaction modals parameters
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [transactionPreviewUrl, setTransactionPreviewUrl] = useState<string>('');
  // Selected router type
  const [routerType] = useAtom(routerTypeAtom);
  const [slippage] = useAtom(slippageToleranceAtom);

  const onSwitchClick = useCallback(() => {
    const mutableAddress0 = address0;
    const mutableAddress1 = address1;
    setAddress0(mutableAddress1);
    setAddress1(mutableAddress0);
  }, [address0, address1]);

  // Fetch balances
  const balance0 = useGetBalance(address0, REFETCH_INTERVALS);
  const balance1 = useGetBalance(address1, REFETCH_INTERVALS);
  // USD equivalents
  const [balance0USD] = useMarketValueUSD(address0, balance0, REFETCH_INTERVALS);
  const [balance1USD] = useMarketValueUSD(address1, balance1, REFETCH_INTERVALS);

  const chainId = useChainId();
  const autoSwapper = useMemo(() => AUTO_SWAP_EXECUTORS[chainId], [chainId]);
  const v2Swapper = useMemo(() => V2_SWAP_EXECUTORS[chainId], [chainId]);
  const v3Swapper = useMemo(() => V3_SWAP_EXECUTORS[chainId], [chainId]);

  // Parsed amounts
  const amount0Parsed = useMemo(() => parseUnits(amount0, asset0?.decimals ?? 18), [amount0, asset0?.decimals]);

  // Allowances
  const autoSwapperAllowance = useGetAllowance(address0, autoSwapper, REFETCH_INTERVALS);
  const v2SwapperAllowance = useGetAllowance(address0, v2Swapper, REFETCH_INTERVALS);
  const v3SwapperAllowance = useGetAllowance(address0, v3Swapper, REFETCH_INTERVALS);

  // Approvals
  const autoSwapperApproval = useApproveSpend(address0, autoSwapper, amount0Parsed);
  const v2SwapperApproval = useApproveSpend(address0, v2Swapper, amount0Parsed);
  const v3SwapperApproval = useApproveSpend(address0, v3Swapper, amount0Parsed);

  const requiresApproval = useMemo(() => {
    switch (routerType) {
      case RouterType.AUTO:
        return autoSwapperAllowance < amount0Parsed;
      case RouterType.V2:
        return v2SwapperAllowance < amount0Parsed;
      case RouterType.V3:
        return v3SwapperAllowance < amount0Parsed;
      default:
        return false;
    }
  }, [amount0Parsed, autoSwapperAllowance, routerType, v2SwapperAllowance, v3SwapperAllowance]);

  // Swap quote
  const swapQuote = usePredictSwapMovement(
    address0,
    address1,
    parseUnits(amount0, asset0?.decimals ?? 18),
    REFETCH_INTERVALS,
  );

  // Unit swap quote
  const unitSwapQuote = usePredictSwapMovement(
    address0,
    address1,
    parseUnits('1', asset0?.decimals ?? 18),
    REFETCH_INTERVALS,
  );

  // Formatted unit swap quote
  const formattedUnitQuote = useMemo(
    () =>
      Number(
        formatUnits(unitSwapQuote.data[unitSwapQuote.data.length - 1]?.amountOut || BI_ZERO, asset1?.decimals ?? 18),
      ),
    [asset1?.decimals, unitSwapQuote.data],
  );

  // Min received
  const minReceived = useMemo(
    () => applySlippage(slippage, swapQuote.data[swapQuote.data.length - 1]?.amountOut || BI_ZERO),
    [slippage, swapQuote.data],
  );

  // Swap executions
  const autoSwap = useAutoSwap(
    address0,
    address1,
    parseUnits(amount0, asset0?.decimals ?? 18),
    swapQuote.data[swapQuote.data.length - 1]?.amountOut || BI_ZERO,
    hash => {
      setTransactionPreviewUrl(`${EXPLORERS[chainId]}/tx/${hash}`);
      setShowSuccess(true);
    },
    () => setShowError(true),
  );
  const v2Swap = useV2Swap(
    address0,
    address1,
    parseUnits(amount0, asset0?.decimals ?? 18),
    swapQuote.data[swapQuote.data.length - 1]?.amountOut || BI_ZERO,
    hash => {
      setTransactionPreviewUrl(`${EXPLORERS[chainId]}/tx/${hash}`);
      setShowSuccess(true);
    },
    () => setShowError(true),
  );
  const v3Swap = useV3Swap(
    address0,
    address1,
    parseUnits(amount0, asset0?.decimals ?? 18),
    swapQuote.data[swapQuote.data.length - 1]?.amountOut || BI_ZERO,
    hash => {
      setTransactionPreviewUrl(`${EXPLORERS[chainId]}/tx/${hash}`);
      setShowSuccess(true);
    },
    () => setShowError(true),
  );

  const initiateProcess = useCallback(() => {
    switch (routerType) {
      case RouterType.AUTO: {
        if (requiresApproval) autoSwapperApproval.execute();
        else autoSwap.execute();
        break;
      }
      case RouterType.V2: {
        if (requiresApproval) v2SwapperApproval.execute();
        else v2Swap.execute();
        break;
      }
      case RouterType.V3: {
        if (requiresApproval) v3SwapperApproval.execute();
        else v3Swap.execute();
        break;
      }
    }
  }, [
    autoSwap,
    autoSwapperApproval,
    requiresApproval,
    routerType,
    v2Swap,
    v2SwapperApproval,
    v3Swap,
    v3SwapperApproval,
  ]);

  return (
    <>
      <div className="flex w-svw flex-1 justify-center items-center flex-col gap-4 py-6 md:py-12 my-36 mx-auto relative px-3">
        <MainSwapView
          asset0={asset0}
          asset1={asset1}
          onSelector0Click={() => setShowModal0(true)}
          onSelector1Click={() => setShowModal1(true)}
          onSwitchClick={onSwitchClick}
          onSettingsClick={() => setShowSettings(true)}
          token0Balance={formatUnits(balance0, asset0?.decimals ?? 18)}
          token1Balance={formatUnits(balance1, asset1?.decimals ?? 18)}
          token0BalanceUSD={formatUnits(balance0USD, 18)}
          token1BalanceUSD={formatUnits(balance1USD, 18)}
          onAmount0Change={setAmount0}
          onAmount1Change={setAmount1}
          needsApproval={requiresApproval}
          onInitiateButtonClick={initiateProcess}
          amount0={amount0}
          amount1={amount1}
          currentPrice={formattedUnitQuote}
          isLoading={
            autoSwap.isLoading ||
            v2Swap.isLoading ||
            v3Swap.isLoading ||
            v2SwapperApproval.isLoading ||
            v3SwapperApproval.isLoading ||
            autoSwapperApproval.isLoading
          }
        />
        <SwapDetails
          asset0={asset0}
          asset1={asset1}
          asset1PerAsset0={formattedUnitQuote}
          minReceived={formatUnits(minReceived, asset1?.decimals ?? 18)}
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
        title="Swap"
        onHide={() => {
          v2SwapperApproval.reset();
          v3SwapperApproval.reset();
          autoSwapperApproval.reset();
          autoSwap.reset();
          v2Swap.reset();
          v3Swap.reset();
          setShowSuccess(false);
        }}
        show={showSuccess}
        transactionPreviewUrl={transactionPreviewUrl}
      />
      <TransactionErrorModal
        title="Swap"
        onHide={() => {
          v2SwapperApproval.reset();
          v3SwapperApproval.reset();
          autoSwapperApproval.reset();
          autoSwap.reset();
          v2Swap.reset();
          v3Swap.reset();
          setShowError(false);
        }}
        show={showError}
      />
    </>
  );
}
