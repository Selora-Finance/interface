"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export type Token = {
  symbol: string;
  name: string;
  logo: string;
};

type Props = {
  tokens: Token[];
  value: string;
  onChange: (symbol: string) => void;
  className?: string;
};

export default function TokenDropdown({ tokens, value, onChange, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const ref = useRef<HTMLDivElement | null>(null);

  const selected = tokens.find((t) => t.symbol === value) ?? tokens[0];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, tokens.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
      } else if (e.key === "Enter") {
        if (highlight >= 0) {
          onChange(tokens[highlight].symbol);
          setOpen(false);
        }
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, highlight, tokens, onChange]);

  useEffect(() => {
    if (open) setHighlight(tokens.findIndex((t) => t.symbol === value));
  }, [open, value, tokens]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Selected Token Button */}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center gap-3 bg-[#333333] rounded px-3 py-2 text-left hover:bg-neutral-600 transition cursor-pointer"
      >
        <Image
          src={selected.logo}
          alt={selected.symbol}
          width={25} 
          height={25} 
          className="rounded-full flex-shrink-0"
        />
        <div className="flex-1">
          <div className="text-white text-sm font-medium">{selected.symbol}</div>
          <div className="text-xs text-gray-400 -mt-0.5">{selected.name}</div>
        </div>

        <svg
          className={`w-3 h-3 transform transition-transform ${open ? "rotate-180" : ""} text-gray-300`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown List */}
      {open && (
        <ul
          role="listbox"
          aria-activedescendant={tokens[highlight]?.symbol}
          className="absolute z-50 mt-2 w-full bg-[#333333] rounded shadow-lg py-1 max-h-[80vh] overflow-y-auto"
        >
          {tokens.map((t, idx) => {
            const active = idx === highlight;
            return (
              <li
                id={t.symbol}
                key={t.symbol}
                role="option"
                aria-selected={t.symbol === value}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => {
                  onChange(t.symbol);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${active ? "bg-neutral-700" : "hover:bg-neutral-700"}`}
              >
                <Image
                  src={t.logo}
                  alt={t.symbol}
                  width={25} 
                  height={25} 
                  className="rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{t.symbol}</div>
                  <div className="text-xs text-gray-400 -mt-0.5">{t.name}</div>
                </div>

                {t.symbol === value && (
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
