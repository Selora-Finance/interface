import React from 'react';
import LogoSvg from '@/public/Logo.svg';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 32, height = 32, className }) => {
  return <LogoSvg width={width} height={height} className={className} />;
};

export default Logo;