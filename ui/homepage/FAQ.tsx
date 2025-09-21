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
    <section className="w-full mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-6">FAQ</h2>
      <div className="space-y-4 w-full">
        {faqs.map((faq, idx) => (
          <div key={faq.q} className="rounded-lg p-4 cursor-pointer w-full bg-[#211b1b]">
            <button
              className="w-full text-left font-medium flex justify-between items-center cursor-pointer"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              {faq.q}
              <span>{openIndex === idx ? <Minus /> : <Plus />}</span>
            </button>
            {openIndex === idx && <p className="mt-2 text-gray-600">{faq.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
