'use client';

import { Themes } from '@/constants';
import { Card } from '../../components/Card';
import { ArrowLeftRight, PiggyBank, Vote } from 'lucide-react';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

const items = [
  { title: 'Trade', text: 'Swap any asset with low fees & deep liquidity.', icon: ArrowLeftRight, route: '/swap' },
  { title: 'Earn', text: 'Provide liquidity, lock $SELO, earn trading fees + emissions.', icon: PiggyBank },
  { title: 'Govern', text: 'Vote with veSELO, direct emissions, earn bribes.', icon: Vote },
];

export default function HowItWorks() {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const router = useRouter();

  return (
    <section className="w-full mx-auto px-10 py-10">
      <h2
        className={`text-2xl font-bold text-center mb-6 ${
          isDarkMode ? 'text-[#fff]' : 'text-[#000]'
        }`}
      >
        How it Works
      </h2>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full">
        {items.map((item) => (
          <Card
            key={item.title}
            variant="secondary"
            onClick={() => item.route && router.push(item.route)}
            className="flex flex-col justify-center items-center gap-3 py-7 px-5 w-full md:w-1/4 self-stretch 
                       cursor-pointer hover:bg-orange-300 transition-colors duration-200"
          >
            <item.icon size={70} />
            <h3 className="text-xl md:text-2xl font-medium">{item.title}</h3>
            <p className="text-sm md:text-lg my-16 text-center">{item.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
