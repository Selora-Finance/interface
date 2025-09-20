import { Twitter, MessageCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="flex justify-center my-8">
      <footer className="w-11/12 max-w-8xl bg-orange-600 text-white p-10 rounded-2xl">
        <div className="container mx-auto">
          {/* Top Section: Logo, Title, and Social Icons */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              {/* Selora Logo */}
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold text-lg">S</span>
              </div>
              {/* Selora Title */}
              <span className="font-bold text-lg">Selora</span>
            </div>

            {/* Social Icons (using lucide-react) */}
            <div className="flex space-x-4 text-white text-xl">
              <Link href="https://x.com" target="_blank" aria-label="X (formerly Twitter)">
                <Twitter className="w-6 h-6" />
              </Link>
              <Link href="https://discord.com" target="_blank" aria-label="Discord">
                <MessageCircle className="w-6 h-6" />
              </Link>
            </div>
          </div>

          {/* Company Description */}
          <p className="text-sm max-w-2xl mb-29 leading-relaxed ">
            Selora is the central trading and liquidity marketplace built on Fluent. It uses Vc(3,3) model to align incentives between liquidity providers, traders, and protocols.
          </p>

          {/* Horizontal Separator Line */}
          <hr className=" border-t border-white-500 my-7 " />

          {/* Bottom Section: Copyright and Legal Links */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="mb-2 md:mb-0">© 2025 Selora Finance. All rights reserved.</p>
            <div className="flex space-x-4">
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