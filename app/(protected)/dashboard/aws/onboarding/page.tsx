"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { AwsOnboardingStep } from "@/types/aws";
import { getAwsConnectionStatus } from "@/services/aws.api";
import {
  RoleArnForm,
  OnboardingProgress
} from "@/components/aws";
import { CloudFormationForm, defaultCloudFormationProps } from "@/components/aws/cloud-formation-form";
import { defaultOnboardingSteps } from "@/components/aws/onboarding-steps";
import { AwsConfigForm } from "@/components/aws/aws-config-form";

const AWSOnboardingPage = () => {
  const router = useRouter();
  const [steps, setSteps] = useState<AwsOnboardingStep[]>(defaultOnboardingSteps);
  const [currentStepId, setCurrentStepId] = useState<string>('intro');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Check if the user already has a connected AWS account
  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        const status = await getAwsConnectionStatus();
        if (status.connected) {
          setIsConnected(true);
          setSteps(steps.map(step => ({ ...step, completed: true, current: false })));
          setCurrentStepId('complete');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to check AWS connection status');
      } finally {
        setIsLoading(false);
      }
    };

    checkConnectionStatus();
  }, []);

  // Move to the next step in the onboarding process
  const goToNextStep = (nextStepId: string) => {
    setSteps(prevSteps => {
      return prevSteps.map(step => {
        if (step.id === currentStepId) {
          return { ...step, completed: true, current: false };
        } else if (step.id === nextStepId) {
          return { ...step, current: true };
        } else {
          return step;
        }
      });
    });
    setCurrentStepId(nextStepId);
  };

  // Handle verification success
  const handleVerificationSuccess = () => {
    goToNextStep('aws-config');
    setIsConnected(true);
  };
  
  // Handle AWS configuration success
  const handleConfigSuccess = () => {
    goToNextStep('complete');
  };

  // Render the content for the current step
  const renderStepContent = () => {
    switch (currentStepId) {
      case 'intro':
        return (
          <Card className="border-none shadow-none">
            <CardContent className="pt-6 space-y-6">
              <h2 className="text-xl font-semibold">Connect Your AWS Account</h2>
              
              <div className="space-y-4">
                <h3 className="font-medium">What you'll need:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Access to your AWS Management Console with administrator privileges</li>
                  <li>Ability to create IAM roles and policies</li>
                  <li>A few minutes to complete the setup process</li>
                </ul>
              </div>

              <Button onClick={() => goToNextStep('deploy-stack')} className="mt-4 w-full">
                Start Setup
              </Button>
            </CardContent>
          </Card>
        );
      
      case 'deploy-stack':
        return (
          <CloudFormationForm 
            onNext={() => goToNextStep('verify-role')} 
            {...defaultCloudFormationProps} 
          />
        );
      
      case 'verify-role':
        return (
          <RoleArnForm 
            onVerificationSuccess={handleVerificationSuccess}
            defaultStackName={defaultCloudFormationProps.stackName}
          />
        );
      
      case 'aws-config':
        return (
          <AwsConfigForm
            onConfigSuccess={handleConfigSuccess}
          />
        );
      
      case 'complete':
        return (
          <Card className="border-none shadow-none">
            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-col items-center justify-center py-6">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-semibold text-center">AWS Account Connected!</h2>
                <p className="text-gray-600 text-center mt-2 max-w-md">
                  Your AWS account is now successfully connected to EasyMarketplace. You can now use all AWS Marketplace features.
                </p>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <Button variant="outline" onClick={() => router.push('/dashboard/listings')}>
                  Go to Listings
                </Button>
                <Button onClick={() => router.push('/dashboard')}>
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <p className="text-sm text-gray-500">Checking AWS connection status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-2">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 bg-slate-100 dark:bg-slate-800">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">AWS Account Connection</h1>
        <OnboardingProgress steps={steps} currentStepId={currentStepId} />
      </div>

      <div className="grid grid-cols-1 gap-8">
          {renderStepContent()}
        </div>
    </div>
  );
};

export default AWSOnboardingPage;