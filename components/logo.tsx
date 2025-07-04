import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
      <Image 
        src="/logo1.png"
        alt="Webvar Logo"
        width={200}
        height={80}
        onClick={() => window.location.href = '/'}
      />
  );
}