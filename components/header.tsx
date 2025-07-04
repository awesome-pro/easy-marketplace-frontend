"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Update scroll state
      setIsScrolled(window.scrollY > 10);
      
      // Calculate scroll progress (0 to 1) for the first 80px of scrolling
      const progress = Math.min(window.scrollY / 80, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate background color based on scroll progress
  const backgroundColor = `rgba(255, 255, 255, ${scrollProgress})`;
  
  // Calculate text color based on scroll progress
  // Interpolate from white (255,255,255) to dark gray (51,51,51)
  const textColorR = Math.round(255 - (204 * scrollProgress));
  const textColorG = Math.round(255 - (204 * scrollProgress));
  const textColorB = Math.round(255 - (204 * scrollProgress));
  const textColor = `rgb(${textColorR}, ${textColorG}, ${textColorB})`;
  
  // Calculate button background color
  // From blue-600 to blue-700
  const buttonColor = isScrolled ? "rgb(37, 99, 235)" : "rgb(59, 130, 246)";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 transition-all duration-300",
        isScrolled ? "shadow-sm backdrop-blur-md" : "bg-gradient-to-b from-black/60 to-transparent"
      )}
      style={{ 
        backgroundColor 
      }}
    >
      <div className="flex items-center">
        <Link href="/" className="mr-8">
          <Image 
            src="https://images.crunchbase.com/image/upload/c_pad,f_auto,q_auto:eco,dpr_1/dl2x00owlmxdpnapp0s1" 
            alt="Calm Logo" 
            width={60} 
            height={60} 
            className="h-12 w-auto rounded-xl" 
          />
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="#" className="font-medium hover:opacity-80 transition-colors duration-300" style={{ color: textColor }}>Sleep</Link>
          <Link href="#" className="font-medium hover:opacity-80 transition-colors duration-300" style={{ color: textColor }}>Stress & Anxiety</Link>
          <Link href="#" className="font-medium hover:opacity-80 transition-colors duration-300" style={{ color: textColor }}>Mindfulness</Link>
          <Link href="#" className="font-medium hover:opacity-80 transition-colors duration-300" style={{ color: textColor }}>Screening</Link>
          <Link href="#" className="font-medium hover:opacity-80 transition-colors duration-300" style={{ color: textColor }}>Calm Health</Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <Link 
          href="#" 
          className="hidden md:inline-block font-medium hover:opacity-80 transition-colors duration-300" 
          style={{ color: textColor }}
        >
          Log In
        </Link>
        <Button 
          className="bg1-gradient text-white rounded-full px-8 py-6 text-lg hover:cursor-pointer transition-colors duration-300"
        >
          Try Calm for Free
        </Button>
      </div>
    </header>
  );
}
