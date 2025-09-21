'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  { q: 'What is Selora?', a: 'Selora is a decentralized trading and liquidity marketplace.' },
  { q: 'How do I earn rewards?', a: 'By providing liquidity and locking $SELO tokens.' },
  { q: 'When is the launch?', a: 'Stay tuned for updates via our waitlist and Discord.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full px-4 py-12 bg-[#F5EEE8]">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">FAQ</h2>
      <div className="space-y-4 w-full max-w-[980px] mx-auto">
        {faqs.map((faq, idx) => (
          <div
            key={faq.q}
            className="rounded-lg p-4 sm:p-6 cursor-pointer bg-white w-full shadow-md transition-shadow hover:shadow-lg"
          >
            <button
              className="w-full text-left font-medium flex justify-between items-center cursor-pointer text-base sm:text-lg"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              {faq.q}
              <span>{openIndex === idx ? <Minus size={20} /> : <Plus size={20} />}</span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === idx ? 'max-h-40 mt-2' : 'max-h-0'
              }`}
            >
              <p className="text-gray-600">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
