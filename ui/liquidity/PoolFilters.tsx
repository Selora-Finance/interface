'use client';

import { Themes, MAX_SCREEN_SIZES } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { useWindowDimensions } from '@/hooks/utils';
import { Plus } from 'lucide-react';

type PoolType = 'concentrated' | 'stable' | 'volatile';

interface PoolFiltersProps {
  activeFilter: PoolType | 'all';
  onFilterChange: (filter: PoolType | 'all') => void;
  onCreatePool?: (type: PoolType) => void;
}

const PoolFilters: React.FC<PoolFiltersProps> = ({ activeFilter, onFilterChange, onCreatePool }) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  const filters: { type: PoolType; label: string }[] = [
    { type: 'concentrated', label: 'Concentrated' },
    { type: 'stable', label: 'Stable' },
    { type: 'volatile', label: 'Volatile' },
  ];

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* All Filter */}
      <button
        onClick={() => onFilterChange('all')}
        className={`px-4 py-2 rounded-lg border transition-all ${
          activeFilter === 'all'
            ? isDarkMode
              ? 'bg-[#333333] border-[#d0de27] text-white'
              : 'bg-orange-50 border-orange-600 text-orange-600'
            : isDarkMode
            ? 'bg-transparent border-[#333333] text-white hover:border-[#555555]'
            : 'bg-transparent border-[#d9d9d9] text-[#000] hover:border-[#999999]'
        } ${isMobile ? 'text-sm' : 'text-base'}`}
      >
        All
      </button>

      {/* Type Filters with Create Button */}
      {filters.map(filter => (
        <button
          key={filter.type}
          onClick={() => onFilterChange(filter.type)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            activeFilter === filter.type
              ? isDarkMode
                ? 'bg-[#333333] border-[#d0de27] text-white'
                : 'bg-orange-50 border-orange-600 text-orange-600'
              : isDarkMode
              ? 'bg-transparent border-[#333333] text-white hover:border-[#555555]'
              : 'bg-transparent border-[#d9d9d9] text-[#000] hover:border-[#999999]'
          } ${isMobile ? 'text-sm' : 'text-base'}`}
        >
          {filter.label}
          <button
            onClick={e => {
              e.stopPropagation();
              onCreatePool?.(filter.type);
            }}
            className={`p-1 rounded ${isDarkMode ? 'hover:bg-[#555555]' : 'hover:bg-[#e0e0e0]'} transition-colors`}
          >
            <Plus size={isMobile ? 14 : 16} />
          </button>
        </button>
      ))}
    </div>
  );
};

export default PoolFilters;
