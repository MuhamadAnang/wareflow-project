"use client";

import Image from "next/image";

interface LogoProps extends React.HTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
}

export default function Logo({ width = 32, height = 32, ...props }: LogoProps) {
  return <Image width={width} height={height} src="/images/logo.png" alt="Logo" {...props} />;
}
