'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Your image data - replace with your actual image paths
  const carouselImages = [
    {
      src: "/images/1.png",
      alt: "UPSC Success Stories",
      title: "Marketplace Products"
    },
    {
      src: "/images/3.png",
      alt: "Youtube Lecture",
      title: "AWS Marketplace Offers"
    },
    {
      src: "/images/4.png",
      alt: "Study Material",
      title: "Marketplace Agreements"
    },
    {
      src: "/images/5.png",
      alt: "Study Material",
      title: "Resale Authorizations"
    },
  ]

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
      }, 2500) // Change slide every 4 seconds

      return () => clearInterval(interval)
    }
  }, [isPaused, carouselImages.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

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
              EasyMarketplace is the ultimate platform connecting ISVs, Resellers, Distributors, and Buyers for seamless collaboration and transactions on AWS Marketplace.
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
                <span className="font-semibold">500+</span> companies already using EasyMarketplace
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative group z-40 shadow-2xl">
              {/* Carousel Wrapper */}
              <div className="relative w-full h-[200px] lg:h-[320px] overflow-hidden rounded-xl bg-white">
                {/* Images */}
                <div 
                  className="flex transition-transform duration-700 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {carouselImages.map((image, index) => (
                    <div key={index} className="min-w-full h-full relative">
                      <Image 
                        src={image.src} 
                        alt={image.alt} 
                        fill
                        className="object-cover"
                        sizes="(max-width: 868px) 100vw, 50vw"
                        priority={index === 0}
                      />
                      {/* Gradient overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      
                      {/* Image title overlay */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white/50 backdrop-blur-sm rounded-full px-4 py-2">
                          <p className="text-sm font-semibold text-gray-900">{image.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <Button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                  aria-label="Previous image"
                  size={'icon'}
                >
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </Button>
                
                <Button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                  aria-label="Next image"
                  size={'icon'}
                >
                  <ArrowRight className="w-5 h-5 text-gray-700" />
                </Button>
              </div>

              {/* Dot Indicators */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'bg-primary w-5' 
                        : 'bg-primary/30 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
