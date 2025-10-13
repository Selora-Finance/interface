'use client';

import { Card } from '@/components';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/client/utils';

interface DashboardCardProps {
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  variant?: 'primary' | 'neutral';
}

const dashboardCardVariants = cva('relative rounded-lg border transition-all cursor-pointer hover:scale-[1.02]', {
  variants: {
    variant: {
      primary: 'bg-white border-[#d9d9d9] hover:border-orange-600 hover:shadow-lg',
      neutral: 'bg-[#1a1515] border-[#333333] hover:border-[#d0de27]',
    },
    isActive: {
      true: '',
      false: 'opacity-60',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      isActive: true,
      className: 'border-orange-600',
    },
    {
      variant: 'neutral',
      isActive: true,
      className: 'border-[#d0de27]',
    },
  ],
  defaultVariants: { variant: 'primary', isActive: true },
});

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  isActive,
  onClick,
  variant = 'primary',
}) => {
  const isDarkMode = variant === 'neutral';

  return (
    <Card variant={variant} className={cn(dashboardCardVariants({ variant, isActive }))} onClick={onClick}>
      <div className="p-6 md:p-8 h-full flex flex-col justify-center">
        {/* Title */}
        <h3
          className={`text-xl md:text-2xl font-semibold mb-3 ${
            isActive ? (isDarkMode ? 'text-[#d0de27]' : 'text-orange-600') : isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} ${
            !isActive ? 'opacity-50' : ''
          }`}
        >
          {description}
        </p>

        {/* Coming Soon Overlay */}
        {!isActive && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Coming Soon!</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DashboardCard;
