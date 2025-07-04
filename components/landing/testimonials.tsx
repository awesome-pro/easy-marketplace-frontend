'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "EasyMarketplace has transformed how we distribute our software on AWS Marketplace. The partner discovery feature helped us find resellers we never would have connected with otherwise.",
    author: "Sarah Johnson",
    role: "CTO at SecureCloud Solutions",
    company: "ISV Partner",
    avatar: "/users/1.png"
  },
  {
    quote: "As a reseller, EasyMarketplace gives us unprecedented visibility into the deal pipeline and makes collaboration with ISVs seamless. Our transaction volume has increased by 40% since joining.",
    author: "Michael Chen",
    role: "VP of Sales at CloudResell",
    company: "Reseller Partner",
    avatar: "/users/2.png"
  },
  {
    quote: "The disbursement tracking alone is worth it. We now have complete transparency into our AWS Marketplace revenue streams across all our partner channels.",
    author: "David Rodriguez",
    role: "Finance Director at TechDistribute",
    company: "Distributor Partner",
    avatar: "/users/3.png"
  },
  {
    quote: "Managing software purchases through AWS Marketplace used to be a headache. With EasyMarketplace, we can track all our offers, contracts, and renewals in one place.",
    author: "Emily Watson",
    role: "Procurement Manager at HealthDataCorp",
    company: "Buyer",
    avatar: "/users/4.png"
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600">
            Join hundreds of companies already transforming their AWS Marketplace experience with EasyMarketplace.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative"
          >
            <div className="text-primary absolute top-8 left-8 md:top-12 md:left-12">
              <Quote size={48} className="opacity-20" />
            </div>
            
            <div className="md:pl-8">
              <blockquote className="text-xl md:text-2xl font-medium text-gray-700 mb-8 relative z-10">
                "{testimonials[currentIndex].quote}"
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-primary">
                  <Image 
                    src={testimonials[currentIndex].avatar || "/avatars/default.png"} 
                    alt={testimonials[currentIndex].author}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonials[currentIndex].author}</div>
                  <div className="text-gray-600">{testimonials[currentIndex].role}</div>
                  <div className="text-primary text-sm">{testimonials[currentIndex].company}</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="flex justify-center mt-8 space-x-4">
            <button 
              onClick={prevTestimonial}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex space-x-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={nextTestimonial}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
