'use client';

import { Button, Modal } from '@/components';
import { DEFAULT_PROCESS_DURATION, Themes } from '@/constants';
import { useSetTimeout } from '@/hooks/utils';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { X, XCircle } from 'lucide-react';
import { useMemo } from 'react';

interface TransactionErrorModalProps {
  show?: boolean;
  onHide?: () => void;
  displayDuration?: number;
  title?: string;
}

const TransactionErrorModal: React.FC<TransactionErrorModalProps> = ({
  show = false,
  onHide = () => {},
  displayDuration = DEFAULT_PROCESS_DURATION,
  title,
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
          <XCircle size={50} />
          <span className="text-lg md:text-xl text-center font-semibold">Transaction Failed</span>
          <span className="text-sm md:text-lg text-center font-light">Your transaction could not be completed</span>
        </div>
        <Button className="w-full text-white cursor-pointer py-5" onClick={onHide}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default TransactionErrorModal;
