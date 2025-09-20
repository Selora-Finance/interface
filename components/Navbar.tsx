"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Logo from './Logo';

interface NavbarProps {
  defaultBg?: string; // Navbar background at top
  scrolledBg?: string; // Navbar background when scrolled
  mobileMenuBg?: string; // Mobile menu background
}

export default function Navbar({
  defaultBg = "bg-gray-800",
  scrolledBg = "bg-orange-50",
  mobileMenuBg,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mobileBg = mobileMenuBg
    ? mobileMenuBg
    : scrolled
    ? scrolledBg
    : defaultBg;

  return (
    <nav
      className={`px-6 py-4 flex justify-between items-center relative transition-all duration-500 ${
        scrolled ? scrolledBg + " shadow-lg" : defaultBg
      } ${scrolled ? "text-gray-900" : "text-white"}`}
    >
      {/* Logo */}
      <Link href="/">
        <Logo className="w-24 md:w-32" />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-6">
        <Link href="#">Trade</Link>
        <Link href="#">Liquidity</Link>
        <Link href="#">Dashboard</Link>
        <Link href="#">Vote</Link>
        <Link href="#">Lock</Link>
        <Link href="#">Incentivize</Link>
      </div>

      {/* Desktop Connect Button */}
      <button className="hidden md:block bg-orange-600 px-6 py-2 rounded-lg text-white">
        Connect
      </button>

      {/* Mobile Menu Button + Connect */}
      <div className="flex items-center gap-2 md:hidden ml-auto">
        <button className="bg-orange-600 px-5 py-2 rounded-lg text-white">
          Connect
        </button>
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle Menu"
          className="p-2"
        >
          <Menu />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div
          className={`absolute top-full left-0 w-full p-6 flex flex-col gap-4 md:hidden transition-colors duration-500 ${mobileBg}`}
        >
          <Link href="#">Trade</Link>
          <Link href="#">Liquidity</Link>
          <Link href="#">Dashboard</Link>
          <Link href="#">Vote</Link>
          <Link href="#">Lock</Link>
          <Link href="#">Incentivize</Link>
        </div>
      )}
    </nav>
  );
}