"use client";

import { useState } from "react";

const faqs = [
  { q: "What is Selora?", a: "Selora is a decentralized trading and liquidity marketplace." },
  { q: "How do I earn rewards?", a: "By providing liquidity and locking $SELO tokens." },
  { q: "When is the launch?", a: "Stay tuned for updates via our waitlist and Discord." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-6">FAQ</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={faq.q} className="border rounded-lg p-4">
            <button
              className="w-full text-left font-medium flex justify-between items-center"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              {faq.q}
              <span>{openIndex === idx ? "-" : "+"}</span>
            </button>
            {openIndex === idx && <p className="mt-2 text-gray-600">{faq.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
