'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { FaXTwitter, FaDiscord } from 'react-icons/fa6';
import { useState, useEffect, useMemo } from 'react';
import Logo from '@/components/Logo';
import { useWindowDimensions } from '@/hooks/utils';
import { MAX_SCREEN_SIZES, Themes } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';

interface NavbarProps {
  defaultBg?: string; // Navbar background at top
  scrolledBg?: string; // Navbar background when scrolled
  mobileMenuBg?: string; // Mobile menu background
}

export default function Navbar({ defaultBg = 'bg-gray-800', scrolledBg = 'bg-orange-50', mobileMenuBg }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dimensions = useWindowDimensions();
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mobileBg = useMemo(
    () => (mobileMenuBg ? mobileMenuBg : scrolled ? scrolledBg : defaultBg),
    [mobileMenuBg, scrolled, scrolledBg, defaultBg],
  );

  return (
    <nav
      className={`px-6 py-4 flex justify-between items-center fixed transition-all duration-500 w-dvw z-20 ${
        scrolled ? scrolledBg + ' shadow-lg' : defaultBg
      } ${scrolled ? 'text-gray-900' : 'text-white'}`}
    >
      {/* Logo */}
      <div className="flex justify-center items-center gap-4">
        <Link href="/">
          <Logo className="w-10 h-10 rounded-full" />
        </Link>
        <span className={`${scrolled ? 'text-[#000]' : 'text-[#fff]'} font-bold text-3xl hidden md:block`}>Selora</span>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-6 justify-center items-center">
        <Link href="#">Trade</Link>
        <Link href="#">Liquidity</Link>
        <Link href="#">Dashboard</Link>
        <Link href="#">Vote</Link>
        <Link href="#">Lock</Link>
        <Link href="#">Incentivize</Link>
      </div>

      <div className="flex justify-center items-center gap-12">
        <div className={`md:flex justify-center gap-3 items-center hidden ${scrolled ? 'text-[#000]' : 'text-white'}`}>
          <a href="https://x.com/Selora_Fi" target="_blank">
            <FaXTwitter size={30} />
          </a>
          <a href="https://discord.gg/FgUyS6nnSx" target="_blank">
            <FaDiscord size={30} />
          </a>
        </div>
        <button className="hidden md:block bg-orange-600 px-6 py-2 rounded-lg text-white">Connect</button>
      </div>

      {/* Mobile Menu Button + Connect */}
      <div className="flex items-center gap-2 md:hidden ml-auto">
        <button className="bg-orange-600 px-5 py-2 rounded-lg text-white">Connect</button>
        <button
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle Menu"
          className={`p-2 rounded-sm ${scrolled || !isDarkMode ? 'bg-[#000] text-[#fff]' : 'bg-[#fff] text-[#000]'}`}
        >
          {!open ? <Menu /> : <X />}
        </button>
      </div>

         {/* Mobile Dropdown Menu */}
<div
  className={`absolute z-[9999] top-full left-0 w-full p-6 flex flex-col gap-4 md:hidden text-white overflow-hidden transition-all duration-500 ease-in-out 
    ${mobileBg} 
    ${open ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'}`}
>
  <Link href="#">Trade</Link>
  <Link href="#">Liquidity</Link>
  <Link href="#">Dashboard</Link>
  <Link href="#">Vote</Link>
  <Link href="#">Lock</Link>
  <Link href="#">Incentivize</Link>
</div>
    </nav>
  );
}
