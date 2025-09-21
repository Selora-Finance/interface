import React from 'react';
import LogoSvg from '@/assets/Logo.svg';
import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 32, height = 32, className }) => (
  <Image src={LogoSvg} width={width} height={height} className={className} alt="image" />
);

export default Logo;
