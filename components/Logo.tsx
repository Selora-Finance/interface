import React, { useMemo } from 'react';
import LogoSvg from '@/assets/Logo.svg';
import LogoOrangeSvg from '@/assets/Logo_Orange.svg';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { themeAtom } from '@/store';
import { Themes } from '@/constants';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 32, height = 32, className }) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const svg = useMemo(() => (isDarkMode ? LogoSvg : LogoOrangeSvg), [isDarkMode]);
  return <Image src={svg} width={width} height={height} className={className} alt="image" />;
};

export default Logo;
