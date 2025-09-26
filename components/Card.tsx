import { cva } from 'class-variance-authority';
import { cn } from '@/lib/client/utils';
import React, { ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'neutral';
}

const cardVariants = cva('rounded-lg transition', {
  variants: {
    variant: {
      primary: 'bg-white text-[#000]',
      secondary: 'bg-orange-600 text-white border border-orange-600',
      neutral: 'bg-[#211b1b] text-[#fff]',
    },
  },
  defaultVariants: { variant: 'primary' },
});

export const Card: React.FC<CardProps> = ({ children, variant = 'primary', className, ...props }) => {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
};
