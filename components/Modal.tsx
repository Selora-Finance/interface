'use client';

import { cva } from 'class-variance-authority';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

const overlayVariants = cva('absolute inset-0 backdrop-blur-sm transition-opacity duration-300', {
  variants: {
    variant: {
      primary: 'bg-white/60 text-[#000]',
      secondary: 'bg-black/60 text-[#fff]',
    },
  },
  defaultVariants: { variant: 'primary' },
});

const modalContentVariants = cva('relative flex flex-col shadow-2xl transition-transform duration-300', {
  variants: {
    variant: {
      primary: 'bg-white text-[#000]',
      secondary: 'bg-[#211b1b] text-white',
    },
  },
  defaultVariants: { variant: 'primary' },
});

export default function Modal({ isOpen, onClose, children, variant }: ModalProps) {
  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 cursor-pointer">
      {/* Overlay */}
      <div className={overlayVariants({ variant })} onClick={onClose} />

      {/* Modal Content */}
      <div
        className={modalContentVariants({ variant })}
        style={{
          width: '90%',
          maxWidth: '499px',
          height: 'auto',
          maxHeight: '90vh',
          borderRadius: '10px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#211b1b',
          opacity: 1,
          transform: 'rotate(0deg)',
          padding: '24px',
          boxSizing: 'border-box',
        }}
      >
        {/* Close Button */}
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-500 text-lg font-bold"
        >
          ✕
        </button> */}

        {/* Modal Content Wrapper */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto gap-4">{children}</div>
      </div>
    </div>
  ) : null;
}
