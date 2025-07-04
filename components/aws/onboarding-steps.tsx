'use client';

import React from 'react';
import { AwsOnboardingStep } from '@/types/aws';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OnboardingStepsProps {
  steps: AwsOnboardingStep[];
  currentStepId: string;
}

export const OnboardingSteps: React.FC<OnboardingStepsProps> = ({ steps, currentStepId }) => {
  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <Card 
          key={step.id} 
          className={cn(
            "border-l-4",
            step.completed ? "border-l-green-500" : 
            step.id === currentStepId ? "border-l-blue-500" : 
            "border-l-gray-200"
          )}
        >
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="flex-shrink-0">
              {step.completed ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <Circle className={cn(
                  "h-6 w-6",
                  step.id === currentStepId ? "text-primary" : "text-gray-300"
                )} />
              )}
            </div>
            <div>
              <CardTitle className="text-lg dark:text-primary">{step.title}</CardTitle>
              <CardDescription className="dark:text-primary">{step.description}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export const defaultOnboardingSteps: AwsOnboardingStep[] = [
  {
    id: 'intro',
    title: 'Introduction',
    description: 'Learn about connecting your AWS account to Webvar',
    completed: false,
    current: true
  },
  {
    id: 'deploy-stack',
    title: 'Deploy CloudFormation Stack',
    description: 'Create the necessary IAM resources in your AWS account',
    completed: false,
    current: false
  },
  {
    id: 'verify-role',
    title: 'Verify IAM Role',
    description: 'Provide the IAM role ARN to verify permissions',
    completed: false,
    current: false
  },
  {
    id: 'aws-config',
    title: 'AWS Configuration',
    description: 'Configure S3 bucket and SNS settings for data access',
    completed: false,
    current: false
  },
  {
    id: 'complete',
    title: 'Connection Complete',
    description: 'Your AWS account is now connected to Webvar',
    completed: false,
    current: false
  }
];
