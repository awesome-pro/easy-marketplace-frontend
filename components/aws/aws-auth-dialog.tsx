"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloudIcon, ArrowRightIcon, Loader2 } from "lucide-react";

interface AwsAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export const AwsAuthDialog = ({ isOpen, onClose, currentPath }: AwsAuthDialogProps) => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Don't show the dialog on the AWS onboarding page itself
  if (currentPath.includes("/dashboard/aws")) {
    return null;
  }

  const handleSetupAws = () => {
    setIsRedirecting(true);
    router.push("/dashboard/aws/onboarding");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <CloudIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">AWS Authentication Required</DialogTitle>
          <DialogDescription className="text-center">
            To access all features and services, you need to set up AWS authentication and configuration.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Setting up AWS authentication allows Webvar to securely access AWS resources on your behalf. This is required to use the full functionality of the platform.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              <li>Secure connection to AWS services</li>
              <li>Access to AWS Marketplace features</li>
              <li>Automated resource management</li>
            </ul>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button onClick={handleSetupAws} disabled={isRedirecting} className="gap-2">
            Set up AWS Authentication
            {isRedirecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRightIcon className="h-4 w-4" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
