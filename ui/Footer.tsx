import { FaDiscord, FaXTwitter } from 'react-icons/fa6';
import Link from 'next/link';
import React from 'react';
import Logo from '@/components/Logo';

const Footer: React.FC = () => {
  return (
    <div className="flex justify-center mt-8 w-full py-4 md:py-16 px-4 md:px-16">
      <footer className="bg-orange-600 text-white p-10 rounded-2xl w-full">
        <div className="container mx-auto">
          {/* Top Section: Logo, Title, and Social Icons */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex justify-center items-center gap-4">
              <Link href="/">
                <Logo className="w-8 h-8 rounded-full" />
              </Link>
              <span className="text-[#fff] font-bold text-lg">Selora</span>
            </div>

            {/* Social Icons (using lucide-react) */}
            <div className="flex justify-center gap-3 items-center text-white">
              <a href="https://x.com/Selora_Fi" target="_blank">
                <FaXTwitter size={30} />
              </a>
              <a href="https://discord.gg/FgUyS6nnSx" target="_blank">
                <FaDiscord size={30} />
              </a>
            </div>
          </div>

          {/* Company Description */}
          <p className="text-sm max-w-2xl mb-29 leading-relaxed ">
            Selora is the central trading and liquidity marketplace built on Fluent. It uses Vc(3,3) model to align
            incentives between liquidity providers, traders, and protocols.
          </p>

          {/* Horizontal Separator Line */}
          <hr className=" border-t border-white-500 my-7 " />

          {/* Bottom Section: Copyright and Legal Links */}
          <div className="flex flex-col-reverse gap-4 md:flex-row justify-start md:justify-between items-start md:items-center text-sm">
            <p className="mb-2 md:mb-0">© 2025 Selora Finance. All rights reserved.</p>
            <div className="flex space-x-8 md:space-x-4">
              <Link href="#" className="hover:underline">
                Terms of Services
              </Link>
              <Link href="#" className="hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
