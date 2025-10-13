'use client';

import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAtom } from 'jotai';
import { themeAtom } from '@/store';
import { Themes } from '@/constants';

interface PoolSelectorProps {
  selectedPool: string | null;
  onPoolSelect: (pool: string) => void;
}

const mockPools = [
  { id: 'eth-usdc', name: 'ETH/USDC', apy: '12.5%' },
  { id: 'btc-eth', name: 'BTC/ETH', apy: '8.3%' },
  { id: 'usdc-usdt', name: 'USDC/USDT', apy: '5.2%' },
];

export function PoolSelector({ selectedPool, onPoolSelect }: PoolSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);

  const selectedPoolData = mockPools.find(pool => pool.id === selectedPool);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`border w-full rounded-lg flex justify-start items-center px-3 py-3 gap-2 ${
          isDarkMode ? 'border-[#333333]' : 'border-[#d9d9d9]'
        } hover:border-gray-500 transition-colors`}
      >
        <div className="flex items-center gap-3 flex-1">
          {/* Token Icons */}
          <div className="flex items-center -space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">E</span>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>

          <span className={`${isDarkMode ? 'text-white' : 'text-[#000]'}`}>
            {selectedPoolData ? selectedPoolData.name : 'Select a pool'}
          </span>
        </div>

        <ChevronDown
          size={20}
          className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 border rounded-lg shadow-lg z-10 ${
            isDarkMode ? 'bg-gray-800 border-[#333333]' : 'bg-white border-[#d9d9d9]'
          }`}
        >
          {mockPools.map(pool => (
            <button
              key={pool.id}
              onClick={() => {
                onPoolSelect(pool.id);
                setIsOpen(false);
              }}
              className={`w-full p-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-[#000]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">E</span>
                    </div>
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+</span>
                    </div>
                  </div>
                  <span>{pool.name}</span>
                </div>
                <span className="text-sm text-[#d0de27]">{pool.apy}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
