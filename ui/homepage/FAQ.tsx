'use client';

import { useMemo, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Themes } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';

const faqs = [
  { q: 'What is Selora?', a: 'Selora is a decentralized trading and liquidity marketplace.' },
  { q: 'How do I earn rewards?', a: 'By providing liquidity and locking $SELO tokens.' },
  { q: 'When is the launch?', a: 'Stay tuned for updates via our waitlist and Discord.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);

  return (
    <section className="w-full mx-auto px-4 py-12">
      <h2 className={`text-2xl font-bold text-center mb-6 ${isDarkMode ? 'text-[#fff]' : 'text-[#000]'}`}>FAQ</h2>
      <div className="space-y-4 w-full">
        {faqs.map((faq, idx) => (
          <button
            key={faq.q}
            className={`rounded-lg px-4 py-7 cursor-pointer w-full ${
              isDarkMode ? 'bg-[#211b1b]' : 'bg-[#fff]'
            } text-left`}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <div
              className={`w-full text-left font-medium flex justify-between items-center cursor-pointer ${
                isDarkMode ? 'text-[#fff]' : 'text-[#000]'
              }`}
            >
              {faq.q}
              <span className={`${isDarkMode ? 'text-[#fff]' : 'text-[#000]'}`}>
                {openIndex === idx ? <Minus /> : <Plus />}
              </span>
            </div>
            {openIndex === idx && <p className="mt-2 text-gray-600">{faq.a}</p>}
          </button>
        ))}
      </div>
    </section>
  );
}
