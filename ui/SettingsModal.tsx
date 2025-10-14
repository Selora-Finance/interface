import { Modal } from '@/components';
import { MAX_SCREEN_SIZES, RouterType, Themes } from '@/constants';
import { useWindowDimensions } from '@/hooks/utils';
import { deadlineAtom, routerTypeAtom, slippageToleranceAtom, themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { X } from 'lucide-react';
import { useMemo } from 'react';

interface SettingsModalProps {
  show?: boolean;
  onHide?: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ show = false, onHide = () => {} }) => {
  const [theme] = useAtom(themeAtom);
  const [selectedRouterType, setRouterType] = useAtom(routerTypeAtom);
  const [slippageTolerance, setSlippageTolerance] = useAtom(slippageToleranceAtom);
  const [transactionDeadline, setTransactionDeadline] = useAtom(deadlineAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  // Slippages
  const slippages = [0.1, 0.5, 1, 5];
  // Router types
  const routerTypes = [RouterType.AUTO, RouterType.V2, RouterType.V3];
  return (
    <Modal isOpen={show} onClose={onHide} variant={isDarkMode ? 'secondary' : 'primary'}>
      <div className="flex flex-col justify-start items-center w-full gap-3 py-2 px-1">
        <div className="flex justify-between w-full gap-3">
          <span className={`${isDarkMode ? 'text-[#fff]' : 'text-[#000]'} font-semibold text-sm md:text-lg`}>
            Settings
          </span>
          <button
            onClick={onHide}
            className="flex justify-center items-center py-1 px-1 rounded-full w-8 h-8 hover:bg-[#d9d9d9]/60 cursor-pointer"
          >
            <X size={25} />
          </button>
        </div>
        <div className="flex flex-col justify-start items-start w-full gap-4">
          {/* Slippages */}
          <div className="flex flex-col gap-3 w-full justify-start items-start">
            <span className={`${isDarkMode ? 'text-[#fff]' : 'text-[#000]'} font-light text-xs md:text-sm`}>
              Slippage Tolerance
            </span>
            <div className="flex justify-start items-center gap-1 w-full">
              {slippages.map((slippage, index) => (
                <button
                  onClick={() => setSlippageTolerance(slippage)}
                  key={index}
                  className={`flex w-[20%] items-center gap-1 justify-center sm:gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all ${
                    slippage === slippageTolerance
                      ? isDarkMode
                        ? 'bg-[#333333] border-[#d0de27] text-white'
                        : 'bg-orange-50 border-orange-600 text-orange-600'
                      : isDarkMode
                      ? 'bg-transparent border-[#333333] text-white hover:border-[#555555]'
                      : 'bg-transparent border-[#d9d9d9] text-[#000] hover:border-[#999999]'
                  } ${isMobile ? 'text-sm px-2' : 'text-base'}`}
                >
                  {slippage}%
                </button>
              ))}
              <div
                className={`w-[20%] bg-transparent py-2 px-3 sm:px-4 rounded-lg border ${
                  isDarkMode
                    ? 'bg-transparent border-[#333333] text-white hover:border-[#555555]'
                    : 'bg-transparent border-[#d9d9d9] text-[#000] hover:border-[#999999]'
                } ${isMobile ? 'text-sm px-2' : 'text-base'}`}
              >
                <input
                  className="w-full bg-transparent outline-0 no-spinner"
                  type="number"
                  onChange={e => setSlippageTolerance(e.target.valueAsNumber || 0.1)}
                />
              </div>
            </div>
          </div>

          {/* Router types */}
          <div className="flex flex-col gap-3 w-full justify-start items-start">
            <span className={`${isDarkMode ? 'text-[#fff]' : 'text-[#000]'} font-light text-xs md:text-sm`}>
              Router
            </span>
            <div className="flex justify-start items-center gap-1 w-full">
              {routerTypes.map((routerType, index) => (
                <button
                  onClick={() => setRouterType(routerType)}
                  key={index}
                  className={`flex w-[33%] items-center gap-1 justify-center sm:gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all ${
                    routerType === selectedRouterType
                      ? isDarkMode
                        ? 'bg-[#333333] border-[#d0de27] text-white'
                        : 'bg-orange-50 border-orange-600 text-orange-600'
                      : isDarkMode
                      ? 'bg-transparent border-[#333333] text-white hover:border-[#555555]'
                      : 'bg-transparent border-[#d9d9d9] text-[#000] hover:border-[#999999]'
                  } ${isMobile ? 'text-sm px-2' : 'text-base'}`}
                >
                  {routerType}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction deadline */}
          <div className="flex flex-col gap-3 w-full justify-start items-start">
            <span className={`${isDarkMode ? 'text-[#fff]' : 'text-[#000]'} font-light text-xs md:text-sm`}>
              Transaction Deadline
            </span>
            <div
              className={`w-full bg-transparent flex justify-start items-center gap-1 py-2 px-3 sm:px-4 rounded-lg border ${
                isDarkMode
                  ? 'bg-transparent border-[#333333] text-white hover:border-[#555555]'
                  : 'bg-transparent border-[#d9d9d9] text-[#000] hover:border-[#999999]'
              } ${isMobile ? 'text-sm px-2' : 'text-base'}`}
            >
              <input
                className="w-[98%] bg-transparent outline-0 no-spinner"
                type="number"
                value={transactionDeadline}
                onChange={e => setTransactionDeadline(e.target.valueAsNumber)}
              />
              <span>Minutes</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
