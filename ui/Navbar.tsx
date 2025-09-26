'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { FaXTwitter, FaDiscord } from 'react-icons/fa6';
import { useState, useEffect, useMemo } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
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

  // RainbowKit hooks
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mobileBg = useMemo(
    () => (mobileMenuBg ? mobileMenuBg : scrolled ? scrolledBg : defaultBg),
    [mobileMenuBg, scrolled, scrolledBg, defaultBg],
  );

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Handle wallet connection/disconnection
  const handleWalletClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      openConnectModal?.();
    }
  };

  return (
    <nav
      className={`px-6 py-4 flex justify-between items-center fixed transition-all duration-500 w-dvw z-20 ${
        scrolled ? scrolledBg + ' shadow-lg' : defaultBg
      } ${scrolled || !isDarkMode ? 'text-[#000]' : 'text-white'}`}
    >
      {/* Logo */}
      <div className="flex justify-center items-center gap-4">
        <Link href="/">
          <Logo className="w-10 h-10 rounded-full" />
        </Link>
        <span
          className={`${scrolled || !isDarkMode ? 'text-[#000]' : 'text-[#fff]'} font-bold text-3xl hidden md:block`}
        >
          Selora
        </span>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-6 justify-center items-center">
        <Link href="/swap">Trade</Link>
        <Link href="/liquidity">Liquidity</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/vote">Vote</Link>
        <Link href="/lock">Lock</Link>
        <Link href="/incentivize">Incentivize</Link>
      </div>

      <div className="flex justify-center items-center gap-12">
        <div
          className={`md:flex justify-center gap-3 items-center hidden ${
            scrolled || !isDarkMode ? 'text-[#000]' : 'text-white'
          }`}
        >
          <a href="https://x.com/Selora_Fi" target="_blank">
            <FaXTwitter size={30} />
          </a>
          <a href="https://discord.gg/FgUyS6nnSx" target="_blank">
            <FaDiscord size={30} />
          </a>
        </div>
        <button 
          onClick={handleWalletClick}
          className="hidden md:block bg-orange-600 px-6 py-2 rounded-lg text-white hover:bg-orange-700 transition-colors"
        >
          {isConnected ? formatAddress(address!) : 'Connect'}
        </button>
      </div>

      {/* Mobile Menu Button + Connect */}
      <div className="flex items-center gap-2 md:hidden ml-auto">
        <button 
          onClick={handleWalletClick}
          className="bg-orange-600 px-5 py-2 rounded-lg text-white hover:bg-orange-700 transition-colors"
        >
          {isConnected ? formatAddress(address!) : 'Connect'}
        </button>
        <button
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle Menu"
          className={`p-2 rounded-sm ${scrolled || !isDarkMode ? 'bg-[#000] text-[#fff]' : 'bg-[#fff] text-[#000]'}`}
        >
          {!open ? <Menu /> : <X />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE && (
        <div
          className={`absolute z-[9999] top-full left-0 w-full p-6 flex flex-col gap-4 md:hidden transition-all duration-1000 ${mobileBg}`}
        >
          <Link href="/swap">Trade</Link>
          <Link href="/liquidity">Liquidity</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/vote">Vote</Link>
          <Link href="/lock">Lock</Link>
          <Link href="/incentivize">Incentivize</Link>
        </div>
      )}
    </nav>
  );
}