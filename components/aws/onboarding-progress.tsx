'use client';

import React from 'react';
import { AwsOnboardingStep } from '@/types/aws';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

export interface OnboardingProgressProps {
  steps: AwsOnboardingStep[];
  currentStepId: string;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ steps, currentStepId }) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);
  
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={cn(
              "flex flex-col items-center relative",
              index === 0 ? "ml-0" : "",
              index === steps.length - 1 ? "mr-0" : ""
            )}
          >
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center z-10 border-2",
                step.completed ? "bg-green-50 border-green-500 text-green-500" : 
                step.id === currentStepId ? "bg-blue-50 border-blue-500 dark:bg-blue-200 dark:border-blue-200 dark:text-blue-500" : 
                index < currentStepIndex ? "bg-gray-100 border-gray-300 text-gray-400" :
                "bg-white border-gray-300 text-gray-300"
              )}
            >
              {step.completed ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span 
              className={cn(
                "text-xs mt-2 font-medium text-center max-w-[80px]",
                step.completed ? "text-green-600" : 
                step.id === currentStepId ? "text-primary" : 
                index < currentStepIndex ? "text-gray-500" :
                "text-gray-400"
              )}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="relative w-full mt-4">
        <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full"></div>
        <div 
          className="absolute top-0 left-0 h-1 bg-blue-500 rounded-full transition-all duration-300"
          style={{ 
            width: `${Math.max(
              (currentStepIndex / (steps.length - 1)) * 100,
              steps.filter(step => step.completed).length > 0 
                ? (steps.filter(step => step.completed).length / (steps.length - 1)) * 100
                : 0
            )}%` 
          }}
        ></div>
      </div>
    </div>
  );
};
