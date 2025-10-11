'use client';

import { cva } from 'class-variance-authority';
import { cn } from '@/lib/client/utils';
import { MAX_SCREEN_SIZES } from '@/constants';
import { useMemo } from 'react';
import { useWindowDimensions } from '@/hooks/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'primary' | 'neutral';
}

const paginationButtonVariants = cva('p-2 rounded-lg border transition-all', {
  variants: {
    variant: {
      primary: 'bg-transparent border-[#d9d9d9] text-[#000] hover:border-[#999999]',
      neutral: 'bg-transparent border-[#333333] text-white hover:border-[#555555]',
    },
  },
  defaultVariants: { variant: 'primary' },
});

const paginationPageVariants = cva('px-3 md:px-4 py-2 rounded-lg border transition-all', {
  variants: {
    variant: {
      primary: 'bg-transparent border-[#d9d9d9] text-[#000] hover:border-[#999999]',
      neutral: 'bg-transparent border-[#333333] text-white hover:border-[#555555]',
    },
    active: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      active: true,
      className: 'bg-orange-50 border-orange-600 text-orange-600',
    },
    {
      variant: 'neutral',
      active: true,
      className: 'bg-[#333333] border-[#d0de27] text-white',
    },
  ],
  defaultVariants: { variant: 'primary', active: false },
});

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, variant = 'primary' }) => {
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = isMobile ? 3 : 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = Math.min(maxVisible - 1, totalPages - 1);
      }

      if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - (maxVisible - 2));
      }

      if (start > 2) pages.push('...');

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) pages.push('...');

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(paginationButtonVariants({ variant }), currentPage === 1 && 'opacity-50 cursor-not-allowed')}
      >
        <ChevronLeft size={isMobile ? 16 : 20} />
      </button>

      <div className="flex gap-2">
        {getPageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={cn(
                paginationPageVariants({ variant, active: currentPage === page }),
                isMobile ? 'text-sm' : 'text-base',
              )}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2 py-2 text-gray-500">
              {page}
            </span>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          paginationButtonVariants({ variant }),
          currentPage === totalPages && 'opacity-50 cursor-not-allowed',
        )}
      >
        <ChevronRight size={isMobile ? 16 : 20} />
      </button>
    </div>
  );
};

export default Pagination;
