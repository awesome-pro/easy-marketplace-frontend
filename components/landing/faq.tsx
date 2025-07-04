'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is EasyMarketplace?",
    answer: "EasyMarketplace is a collaboration and analytics tool that connects Vendors (ISVs), Resellers, Distributors, and Buyers transacting on AWS Marketplace. The platform allows all parties to collaborate on deals, track listing performance, manage disbursements, and discover relevant partners—all tied to each user's AWS ID."
  },
  {
    question: "How does EasyMarketplace integrate with AWS Marketplace?",
    answer: "EasyMarketplace integrates with AWS Marketplace through a combination of AWS ID authentication, API connections for listings and offers, and our DSOR (Designated Seller of Record) capabilities. This allows for seamless transaction processing, disbursement tracking, and offer management."
  },
  {
    question: "Do I need an AWS account to use EasyMarketplace?",
    answer: "Yes, you'll need an AWS account to fully utilize EasyMarketplace's features. During the sign-up process, you'll be prompted to connect your AWS ID, which enables personalized data views and secure transactions."
  },
  {
    question: "What roles are supported on EasyMarketplace?",
    answer: "EasyMarketplace supports four primary roles: Independent Software Vendors (ISVs), Resellers, Distributors, and Buyers. Each role has access to specialized features and workflows designed for their specific needs in the AWS Marketplace ecosystem."
  },
  {
    question: "How does the partner discovery feature work?",
    answer: "Our partner discovery feature allows you to search and filter potential partners based on criteria relevant to your business needs. ISVs can find resellers and distributors, while resellers can discover ISVs with compatible products. The system provides recommendations and detailed profiles to help you make informed decisions."
  },
  {
    question: "What is a Deal Room?",
    answer: "A Deal Room is a shared workspace where all parties involved in a transaction can collaborate in real-time. It includes features for document sharing, commenting, and tracking the progress of deals from initial offer to completion."
  },
  {
    question: "How does EasyMarketplace handle disbursement tracking?",
    answer: "EasyMarketplace provides comprehensive disbursement tracking tied to your AWS ID. You can view payouts, commissions, and revenue sharing across all your AWS Marketplace transactions, with detailed breakdowns by product, partner, and time period."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, EasyMarketplace offers a 30-day free trial with full access to all features. No credit card is required to start your trial."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Find answers to common questions about EasyMarketplace and how it can help your business.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full text-left p-6 rounded-lg flex justify-between items-center ${
                  openIndex === index 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                } transition-colors`}
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <ChevronDown 
                  className={`transition-transform ${openIndex === index ? 'rotate-180' : ''}`} 
                  size={20} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-gray-50 rounded-b-lg text-gray-700">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
