'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-primary/5 via-cyan-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Connect, Collaborate, and <span className="text-primary">Transact</span> on AWS Marketplace
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Webvar is the ultimate platform connecting ISVs, Resellers, Distributors, and Buyers for seamless collaboration and transactions on AWS Marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="w-full md:w-auto rounded-full px-8 py-6 text-lg">
                  Get Started
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="w-full md:w-auto rounded-full px-8 py-6 text-lg">
                  How It Works
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                    <Image 
                      src={`/users/${i}.png`} 
                      alt="User avatar" 
                      width={40} 
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-gray-600">
                <span className="font-semibold">500+</span> companies already using Webvar
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="aspect-[16/9] relative">
                <Image
                  src="/images/3.png"
                  alt="Webvar Dashboard"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
