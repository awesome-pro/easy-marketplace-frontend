'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  Building, 
  Handshake, 
  ShieldCheck, 
  Clock, 
  Zap,
  Search
} from 'lucide-react';

const features = [
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Partner Discovery',
    description: 'Find the perfect ISVs, resellers, and distributors based on your needs and criteria.',
    color: 'bg-blue-100',
    textColor: 'text-blue-600'
  },
  {
    icon: <Handshake className="h-6 w-6" />,
    title: 'Live Deal Room',
    description: 'Collaborate in real-time with partners on deals, offers, and contracts.',
    color: 'bg-green-100',
    textColor: 'text-green-600'
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Disbursement Dashboard',
    description: 'Track payouts and revenue across all your AWS Marketplace transactions.',
    color: 'bg-purple-100',
    textColor: 'text-purple-600'
  },
  {
    icon: <Building className="h-6 w-6" />,
    title: 'Offer Management',
    description: 'Create, track, and manage private offers with seamless AWS integration.',
    color: 'bg-amber-100',
    textColor: 'text-amber-600'
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'AWS ID Integration',
    description: 'Connect your AWS ID for personalized data views and secure transactions.',
    color: 'bg-red-100',
    textColor: 'text-red-600'
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: 'Listing Performance',
    description: 'Track engagement, conversions, and performance metrics for your listings.',
    color: 'bg-teal-100',
    textColor: 'text-teal-600'
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Centralized Management',
    description: 'Manage all your AWS Marketplace activities in one streamlined platform.',
    color: 'bg-indigo-100',
    textColor: 'text-indigo-600'
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Accelerated Transactions',
    description: 'Reduce friction and accelerate time-to-market with automated workflows.',
    color: 'bg-pink-100',
    textColor: 'text-pink-600'
  }
];

export function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Succeed on AWS Marketplace
          </h2>
          <p className="text-xl text-gray-600">
            Webvar combines powerful tools and seamless integrations to help you connect, collaborate, and transact with confidence.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              variants={itemVariants}
            >
              <div className={`${feature.color} ${feature.textColor} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
