import { cva } from 'class-variance-authority';
import { cn } from '@/lib/client/utils';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'neutral' | 'dark';
}

const buttonVariants = cva(
  'px-6 py-2 rounded-lg font-semibold transition focus:outline-none active:ring-2 active:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-orange-600 text-white hover:bg-orange-700 active:ring-orange-500',
        secondary: 'bg-white text-orange-600 border border-orange-600 hover:bg-orange-50 active:ring-orange-500',
        neutral: 'bg-transparent hover:bg-[#d9d9d9]/70',
        dark: 'bg-[#333333] text-[#fff] hover:bg-[#333333]/40',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
);

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, ...props }) => (
  <button className={cn(buttonVariants({ variant }), className)} {...props} />
);
