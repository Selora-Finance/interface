'use client'; 

import './globals.css';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function GlobalNotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/'); // redirect to home after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); 
  }, [router]);

  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className="bg-[#F5EEE8] dark:bg-gray-900 min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
          
          
          <div className="absolute top-20 left-2 md:left-1/5 w-32 h-32 md:w-64 md:h-64 bg-orange-600 rounded-full filter blur opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-2 md:right-1/5 w-16 h-16 md:w-32 md:h-32 bg-orange-600 rounded-full filter blur opacity-30 animate-pulse"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 max-w-5xl w-full relative z-10">

           
            <div className="relative w-40 h-40 sm:w-52 sm:h-52 flex-shrink-0">
              <Image
                src="/404.png"
                alt="Retro TV displaying a 404 error"
                width={208}
                height={208}
                className="object-contain"
              />
            </div>

            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                Oops!
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
                This page does not exist or is currently under construction.
              </p>

              <p className="text-gray-500 mb-4">Redirecting to home in 5 seconds...</p>

              <Link
                href="/"
                className="inline-flex items-center px-5 py-2 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-orange-600 hover:bg-red-700 transition-colors duration-300"
              >
                ← Go Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
