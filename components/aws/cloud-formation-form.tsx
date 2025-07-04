'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLink, Info, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export interface CloudFormationFormProps {
  onNext: () => void;
  cloudFormationUrl: string;
  stackName: string;
  roleName: string;
  policyName: string;
  serviceAccountArn: string;
}

export const CloudFormationForm: React.FC<CloudFormationFormProps> = ({
  onNext,
  cloudFormationUrl,
  stackName,
  roleName,
  policyName,
  serviceAccountArn
}) => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-5">
        <CardTitle className="text-xl">Deploy CloudFormation Stack</CardTitle>
        <CardDescription>
          Create the necessary IAM resources in your AWS account to allow Webvar to access your AWS Marketplace data
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5 space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Follow these steps:</h3>
          <ol className="list-decimal pl-5 space-y-4">
            <li>
              <p className="mb-1">Log in to your AWS Management Console</p>
              <p className="text-sm text-gray-500">Make sure you have administrator privileges to create IAM resources</p>
            </li>
            <li>
              <p className="mb-1">Click the button below to open the CloudFormation quick-create link</p>
              <Button variant="outline" asChild className="mt-2 w-full px-4">
                <Link href={cloudFormationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center w-full border-primary text-primary border-2">
                  <span>Open AWS CloudFormation</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </li>
            <li>
              <p className="mb-1">Verify the following parameters:</p>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded mt-2 space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium">Stack name:</span>
                  <span>{stackName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium">WebvarRoleName:</span>
                  <span>{roleName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium">WebvarPolicyName:</span>
                  <span>{policyName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium">WebvarServiceAccountArn:</span>
                  <span className="break-all">{serviceAccountArn}</span>
                </div>
              </div>
            </li>
            <li>
              <p className="mb-1">Check the acknowledgment box and click "Create stack"</p>
              <p className="text-sm text-gray-500">This acknowledges that AWS CloudFormation might create IAM resources</p>
            </li>
            <li>
              <p className="mb-1">Wait for the stack creation to complete</p>
              <p className="text-sm text-gray-500">This may take a few minutes. The status should show "CREATE_COMPLETE" when finished</p>
            </li>
            <li>
              <p className="mb-1">Find the IAM role ARN in the stack outputs</p>
              <p className="text-sm text-gray-500">
                Go to the "Outputs" tab of your stack and look for the "WebvarRoleArn" value.
                It should look like: <code className="bg-gray-100  px-1 rounded">arn:aws:iam::123456789012:role/{roleName}</code>
              </p>
            </li>
          </ol>
        </div>

        <Alert variant="default" className="bg-amber-50 border-amber-200 dark:bg-amber-900 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            After deploying the CloudFormation stack, you will need to provide the IAM role ARN in the next step to complete the connection.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="px-5 flex justify-between">
        <Button variant="default" onClick={onNext} className="px-4 w-full">
          I've deployed the stack, continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export const defaultCloudFormationProps = {
  cloudFormationUrl: 'https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateURL=https%3A%2F%2Fcf-templates-prod-cluster.s3.amazonaws.com%2Fwebvar_connect.json&stackName=Webvar&param_WebvarPolicyName=WebvarAgreementsAPI&param_WebvarServiceAccountArn=arn%3Aaws%3Aiam%3A%3A342635257821%3Auser%2Fservice-account%2Fwv-agreements-service-account&param_WebvarRoleName=WebvarAgreementsAPI',
  stackName: 'Webvar',
  roleName: 'WebvarAgreementsAPI',
  policyName: 'WebvarAgreementsAPI',
  serviceAccountArn: 'arn:aws:iam::342635257821:user/service-account/wv-agreements-service-account'
};
