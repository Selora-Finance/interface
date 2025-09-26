'use client';

import { Button, Modal } from '@/components';
import { DEFAULT_PROCESS_DURATION, Themes } from '@/constants';
import { useSetTimeout } from '@/hooks/utils';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { CircleAlert } from 'lucide-react';
import { useMemo } from 'react';

interface WaitlistErrorModalProps {
  message?: string;
  show?: boolean;
  onHide?: () => void;
  displayDuration?: number;
}

const WaitlistErrorModal: React.FC<WaitlistErrorModalProps> = ({
  show = false,
  message = 'An error occured',
  onHide = () => {},
  displayDuration = DEFAULT_PROCESS_DURATION,
}) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);

  useSetTimeout(onHide, displayDuration);

  return (
    <Modal isOpen={show} onClose={onHide} variant={isDarkMode ? 'secondary' : 'primary'}>
      <div className="flex flex-col justify-center items-center gap-4 w-full">
        <div
          className={`flex justify-center items-center flex-col w-full gap-5 ${
            isDarkMode ? 'text-[#fff]' : 'text-[#000]'
          }`}
        >
          <CircleAlert size={40} />
          <span className="text-sm md:text-lg text-center">{message}</span>
        </div>
        <Button className="w-full text-white cursor-pointer py-5" onClick={onHide}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default WaitlistErrorModal;
