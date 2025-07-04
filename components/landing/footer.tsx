'use client';

import Link from 'next/link';
import { FaFacebookSquare, FaLinkedin, FaInstagram, FaGithubSquare } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            {/* <Logo variant="light" /> */}
            <p className="mt-4 mb-6 text-gray-400 max-w-md">
              Webvar connects ISVs, Resellers, Distributors, and Buyers for seamless collaboration and transactions on AWS Marketplace.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <FaFacebookSquare />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <FaXTwitter />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <FaLinkedin />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <FaInstagram />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <FaGithubSquare />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="#roles" className="text-gray-400 hover:text-white transition-colors">For Your Role</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/partners" className="text-gray-400 hover:text-white transition-colors">Partners</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/security" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
              <li><Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Webvar. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-gray-500 hover:text-white transition-colors text-sm">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors text-sm">
              Privacy
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-white transition-colors text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
