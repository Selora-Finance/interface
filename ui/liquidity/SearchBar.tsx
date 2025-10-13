'use client';

import { Themes, MAX_SCREEN_SIZES } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { useWindowDimensions } from '@/hooks/utils';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  return (
    <div
      className={`border rounded-lg flex justify-start items-center px-4 py-3 gap-3 ${
        isMobile ? 'w-full' : 'w-auto min-w-[300px]'
      } ${isDarkMode ? 'border-[#333333] bg-[#211b1b]' : 'border-[#d9d9d9] bg-white'}`}
    >
      <Search size={isMobile ? 16 : 20} className="text-gray-500" />
      <input
        type="text"
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        className={`flex-1 bg-transparent outline-0 ${
          isDarkMode ? 'text-white placeholder-gray-500' : 'text-[#000] placeholder-gray-400'
        } ${isMobile ? 'text-sm' : 'text-base'}`}
        placeholder="Symbol or address..."
      />
    </div>
  );
};

export default SearchBar;
