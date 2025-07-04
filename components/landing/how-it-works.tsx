'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const steps = [
  {
    number: '01',
    title: 'Connect Your AWS ID',
    description: 'Sign up and connect your AWS ID to personalize your experience and enable secure transactions.',
    image: '/images/4.png'
  },
  {
    number: '02',
    title: 'Discover Partners',
    description: 'Find the perfect ISVs, resellers, or distributors based on your business needs and criteria.',
    image: '/images/5.png'
  },
  {
    number: '03',
    title: 'Collaborate on Deals',
    description: 'Work together in shared deal rooms to finalize offers, terms, and agreements.',
    image: '/images/6.png'
  },
  {
    number: '04',
    title: 'Transact Seamlessly',
    description: 'Complete transactions through AWS Marketplace with automated workflows and tracking.',
    image: '/images/1.png'
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-cyan-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Webvar Works
          </h2>
          <p className="text-xl text-gray-600">
            Our streamlined process makes AWS Marketplace transactions faster, easier, and more transparent for all parties.
          </p>
        </div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={`order-2 ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="rounded-2xl shadow-xl overflow-hidden border border-gray-100 aspect-video relative">
                  <Image
                    src={step.image || '/placeholder-image.png'}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div className={`order-1 ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="bg-primary/10 text-primary font-bold text-lg rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {step.number}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{step.title}</h3>
                <p className="text-xl text-gray-600 mb-6">{step.description}</p>
                <div className="w-20 h-1 bg-primary rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
