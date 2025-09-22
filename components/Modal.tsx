'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 cursor-pointer">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="relative bg-[#211b1b] text-white flex flex-col shadow-2xl transition-transform duration-300"
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
