'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-cyan-600 to-cyan-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your AWS Marketplace Experience?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies already using Webvar to connect, collaborate, and transact on AWS Marketplace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" variant="secondary" className="rounded-full w-full md:w-auto px-8 py-6 text-lg">
                Get Started for Free
              </Button>
            </Link>
            <Link href="#contact">
              <Button size="lg" variant="outline" className="rounded-full w-full md:w-auto px-8 py-6 text-lg bg-transparent border-white text-white hover:bg-white/10 hover:text-white">
                Contact Sales
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm opacity-80">
            No credit card required. Start with a 30-day free trial.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
