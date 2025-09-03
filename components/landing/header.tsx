'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-8">
            <Logo />
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-primary font-medium">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-primary font-medium">
              How It Works
            </Link>
            <Link href="#roles" className="text-gray-600 hover:text-primary font-medium">
              For Your Role
            </Link>
            <Link href="#faq" className="text-gray-600 hover:text-primary font-medium">
              FAQ
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/auth/sign-in">
            <Button variant="outline" className="rounded-full px-6 dark:text-black">Sign In</Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button className="rounded-full px-6">Get Started</Button>
          </Link>
        </div>

        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link 
              href="#features" 
              className="text-gray-600 hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-gray-600 hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="#roles" 
              className="text-gray-600 hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              For Your Role
            </Link>
            <Link 
              href="#faq" 
              className="text-gray-600 hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
              <Link href="/auth/sign-in">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
