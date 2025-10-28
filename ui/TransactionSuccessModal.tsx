'use client';

import { Modal } from '@/components';
import { DEFAULT_PROCESS_DURATION, Themes } from '@/constants';
import { useSetTimeout } from '@/hooks/utils';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { CheckCircle2, X } from 'lucide-react';
import { useMemo } from 'react';

interface TransactionSuccessModalProps {
  show?: boolean;
  onHide?: () => void;
  displayDuration?: number;
  title?: string;
  transactionPreviewUrl?: string;
}

const TransactionSuccessModal: React.FC<TransactionSuccessModalProps> = ({
  show = false,
  onHide = () => {},
  displayDuration = DEFAULT_PROCESS_DURATION,
  title,
  transactionPreviewUrl,
}) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);

  useSetTimeout(onHide, displayDuration);

  return (
    <Modal isOpen={show} onClose={onHide} variant={isDarkMode ? 'secondary' : 'primary'}>
      <div
        className={`flex justify-center items-center flex-col w-full gap-5 ${
          isDarkMode ? 'text-[#fff]' : 'text-[#000]'
        }`}
      >
        <div className="flex justify-between w-full gap-3">
          <span className={`${isDarkMode ? 'text-[#fff]' : 'text-[#000]'} font-semibold text-sm md:text-lg`}>
            {title ?? 'Transaction'}
          </span>
          <button
            onClick={onHide}
            className="flex justify-center items-center py-1 px-1 rounded-full w-8 h-8 hover:bg-[#d9d9d9]/60 cursor-pointer"
          >
            <X size={25} />
          </button>
        </div>
        <div className="flex w-full flex-col justify-center items-center gap-3">
          <CheckCircle2 size={100} color="#d0de27" />
          <span className="text-lg md:text-xl text-center font-semibold">Transaction Processed</span>
          <span className="text-sm md:text-lg text-center font-light">Your transaction has been processed!</span>
        </div>
        {transactionPreviewUrl && (
          <a
            href={transactionPreviewUrl}
            target="_blank"
            className={`underline ${isDarkMode ? 'text-[#fff]' : 'text-[#000]'} text-sm md:text-lg`}
          >
            View on explorer
          </a>
        )}
      </div>
    </Modal>
  );
};

export default TransactionSuccessModal;
