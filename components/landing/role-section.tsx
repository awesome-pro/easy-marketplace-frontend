'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const roles = [
  {
    id: 'isv',
    name: 'ISV',
    title: 'For Independent Software Vendors',
    description: 'Scale your AWS Marketplace presence and connect with resellers to expand your reach.',
    features: [
      'Duplicate listings via EasyMarketplace integration',
      'Track listing performance and engagement',
      'View disbursement data tied to AWS ID',
      'Connect with resellers and distributors',
      'Collaborate in shared deal rooms',
      'Manage the full post-listing journey'
    ],
    cta: 'Start Selling',
    image: '/images/3.png'
  },
  {
    id: 'reseller',
    name: 'Reseller',
    title: 'For Resellers',
    description: 'Discover ISVs, create private offers, and grow your software distribution business.',
    features: [
      'Sign up and integrate AWS ID',
      'View disbursements and agreements',
      'Create or join private offers',
      'Discover ISVs and distributors',
      'Collaborate on deals and transactions',
      'Track commission and performance'
    ],
    cta: 'Start Reselling',
    image: '/images/11.png'
  },
  {
    id: 'distributor',
    name: 'Distributor',
    title: 'For Distributors',
    description: 'Enable networks of ISVs and resellers to connect and transact efficiently.',
    features: [
      'Monitor all deal activity',
      'View unified disbursement reporting',
      'Manage offer scaling across partners',
      'Connect ISVs with resellers',
      'Track network performance',
      'Optimize partner relationships'
    ],
    cta: 'Start Distributing',
    image: '/images/12.png'
  },
  {
    id: 'buyer',
    name: 'Buyer',
    title: 'For Buyers',
    description: 'Review offers, track contracts, and manage all your AWS software purchases in one place.',
    features: [
      'Review offers across storefronts',
      'Track offer lifecycle and quotes',
      'Manage accepted deals and contracts',
      'Centralize renewal management',
      'Optimize software spending',
      'Streamline procurement process'
    ],
    cta: 'Start Buying',
    image: '/images/13.png'
  }
];

export function RoleSection() {
  const [activeTab, setActiveTab] = useState('isv');

  return (
    <section id="roles" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tailored for Your Role
          </h2>
          <p className="text-xl text-gray-600">
            EasyMarketplace provides specialized features and workflows for each participant in the AWS Marketplace ecosystem.
          </p>
        </div>

        <Tabs 
          defaultValue="isv" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 gap-2 md:gap-4 bg-transparent h-auto mb-12">
            {roles.map((role) => (
              <TabsTrigger 
                key={role.id}
                value={role.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {role.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {roles.map((role) => (
            <TabsContent 
              key={role.id} 
              value={role.id}
              className="mt-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl p-8 md:p-12 bg-cyan-50"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">{role.title}</h3>
                    <p className="text-xl text-gray-600 mb-8">{role.description}</p>
                    
                    <ul className="space-y-4 mb-8">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-3 mt-0.5">
                            <Check size={16} />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href="/auth/sign-up">
                      <Button size="lg" className="rounded-full px-8">
                        {role.cta}
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="rounded-2xl shadow-xl overflow-hidden border border-gray-100 aspect-video relative">
                    <Image
                      src={role.image || '/placeholder-image.png'}
                      alt={role.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
