'use client';

import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";

const EstateLoading = ({ 
  className = '', 
  size = 'md',
  tagline = 'The Sovereign Innovation'
}: { 
  className?: string, 
  textClassName?: string,
  size?: 'sm' | 'md' | 'lg' | 'xl',
  brandName?: string,
  tagline?: string
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Animated text variants with subtle float
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05 + 1,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }
    })
  };

  // Dynamic sizing based on the size prop
  const sizeClasses = {
    sm: {
      container: 'w-28 h-28',
      chevron: 'w-24 h-14',
      text: 'text-sm',
      subtitle: 'text-xs',
      spacing: 'top-3',
      spacing2: 'top-6'
    },
    md: {
      container: 'w-44 h-44',
      chevron: 'w-36 h-18',
      text: 'text-lg',
      subtitle: 'text-sm',
      spacing: 'top-4',
      spacing2: 'top-8'
    },
    lg: {
      container: 'w-64 h-64',
      chevron: 'w-52 h-28',
      text: 'text-2xl',
      subtitle: 'text-base',
      spacing: 'top-5',
      spacing2: 'top-10'
    },
    xl: {
      container: 'w-80 h-80',
      chevron: 'w-64 h-32',
      text: 'text-3xl',
      subtitle: 'text-lg',
      spacing: 'top-6',
      spacing2: 'top-12'
    }
  };

  const currentSize = sizeClasses[size];
  
  return (
    <div className={`flex items-center justify-center ${className} mt-10`}>
      {/* Main container with premium glass effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative p-6 sm:p-10 rounded-3xl backdrop-blur-xl bg-black/5 dark:bg-white/5 shadow-2xl border border-blue-800/20 dark:border-white/10"
      >
        {/* Logo container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className={`relative ${currentSize.container} flex items-center justify-center`}
        >
          {/* Chevron 1 - Top (brightest) */}
          <motion.div
            className={`absolute ${currentSize.chevron} text-primary z-30`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              y: [10, 0, 0, -10] 
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              times: [0, 0.3, 0.7, 1],
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 100 50" className="w-full h-full">
              <defs>
                <linearGradient id="topGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aef" className="dark:text-white dark:[stop-color:white]" />
                  <stop offset="50%" stopColor="#6d28d9" className="dark:text-white dark:[stop-color:white]" />
                  <stop offset="100%" stopColor="#5b21b6" className="dark:text-white dark:[stop-color:white]" />
                </linearGradient>
              </defs>
              <path 
                d="M10,40 L50,10 L90,40" 
                stroke="url(#topGradient)" 
                strokeWidth="12" 
                fill="none" 
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="drop-shadow(0px 0px 4px rgba(124, 58, 237, 0.6)) drop-shadow(0px 0px 1px rgba(124, 58, 237, 0.8))"
                className="dark:stroke-white dark:[filter:drop-shadow(0px_0px_4px_rgba(255,255,255,0.6))]"
              />
            </svg>
          </motion.div>
          
          {/* Chevron 2 - Middle */}
          <motion.div 
            className={`absolute ${currentSize.chevron} ${currentSize.spacing} text-primary/80 dark:text-white/80 z-20`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: [0, 0.85, 0.85, 0],
              y: [10, 0, 0, -10] 
            }}
            transition={{ 
              duration: 3,
              delay: 0.5,
              repeat: Infinity,
              times: [0, 0.3, 0.7, 1],
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 100 50" className="w-full h-full">
              <defs>
                <linearGradient id="bottomGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#5b21b6" className="dark:text-white/60 dark:[stop-color:rgba(255,255,255,0.6)]" />
                  <stop offset="50%" stopColor="#4c1d95" className="dark:text-white/60 dark:[stop-color:rgba(255,255,255,0.6)]" />
                  <stop offset="100%" stopColor="#3b0764" className="dark:text-white/60 dark:[stop-color:rgba(255,255,255,0.6)]" />
                </linearGradient>
              </defs>
              <path 
                d="M10,40 L50,10 L90,40" 
                stroke="url(#bottomGradient)" 
                strokeWidth="12" 
                fill="none" 
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
                className="dark:stroke-white/60"
              />
            </svg>
          </motion.div>
          
          {/* Chevron 3 - Bottom (faintest) */}
          <motion.div 
            className={`absolute ${currentSize.chevron} ${currentSize.spacing2} text-primary/60 dark:text-white/60 z-10`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: [0, 0.7, 0.7, 0],
              y: [10, 0, 0, -10] 
            }}
            transition={{ 
              duration: 3,
              delay: 1,
              repeat: Infinity,
              times: [0, 0.3, 0.7, 1],
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 100 50" className="w-full h-full">
              <defs>
                <linearGradient id="bottomGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#5b21b6" className="dark:text-white/60 dark:[stop-color:rgba(255,255,255,0.6)]" />
                  <stop offset="50%" stopColor="#4c1d95" className="dark:text-white/60 dark:[stop-color:rgba(255,255,255,0.6)]" />
                  <stop offset="100%" stopColor="#3b0764" className="dark:text-white/60 dark:[stop-color:rgba(255,255,255,0.6)]" />
                </linearGradient>
              </defs>
              <path 
                d="M10,40 L50,10 L90,40" 
                stroke="url(#bottomGradient)" 
                strokeWidth="12" 
                fill="none" 
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
                className="dark:stroke-white/60"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Elegant progress indicator */}
        <motion.div className="relative h-0.5 mt-4 overflow-hidden rounded-full bg-blue-900/30 dark:bg-white/10">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 2.5, 
              ease: "easeInOut",
              repeatType: "loop"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent dark:via-white"
          />
        </motion.div>

        
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent dark:via-white/50 rounded-3xl"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ 
            repeat: Infinity, 
            duration: 3, 
            ease: "easeInOut",
            repeatType: "loop"
          }}
        />
      </motion.div>
    </div>
  );
};

export default EstateLoading;