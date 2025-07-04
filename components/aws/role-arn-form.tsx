'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { verifyCloudFormationStack } from '@/services/aws.api';

// Zod schema for role ARN validation
const roleArnSchema = z.object({
  stackName: z.string().min(1, 'Stack name is required'),
  roleArn: z.string()
    .min(20, 'Role ARN is required')
    .regex(
      /^arn:aws:iam::\d{12}:role\/[a-zA-Z0-9+=,.@_-]+$/,
      'Invalid ARN format. Should be like: arn:aws:iam::123456789012:role/RoleName'
    )
});

type RoleArnFormValues = z.infer<typeof roleArnSchema>;

export interface RoleArnFormProps {
  onVerificationSuccess: () => void;
  defaultStackName: string;
}

export const RoleArnForm: React.FC<RoleArnFormProps> = ({
  onVerificationSuccess,
  defaultStackName
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const form = useForm<RoleArnFormValues>({
    resolver: zodResolver(roleArnSchema),
    defaultValues: {
      stackName: defaultStackName,
      roleArn: ''
    }
  });

  const onSubmit = async (values: RoleArnFormValues) => {
    setIsVerifying(true);
    setVerificationError(null);
    setVerificationSuccess(false);

    try {
      const response = await verifyCloudFormationStack({
        stackName: values.stackName,
        roleArn: values.roleArn
      });

      if (response.success) {
        setVerificationSuccess(true);
        setTimeout(() => {
          onVerificationSuccess();
        }, 1500);
      } else {
        setVerificationError(response.message || 'Verification failed. Please check your role ARN and try again.');
      }
    } catch (error: any) {
      setVerificationError(error.message || 'An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-5">
        <CardTitle className="text-xl">Verify IAM Role</CardTitle>
        <CardDescription>
          Provide the IAM role ARN created by the CloudFormation stack to complete the connection
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="stackName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CloudFormation Stack Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Webvar" />
                  </FormControl>
                  <FormDescription>
                    The name of the CloudFormation stack you deployed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleArn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IAM Role ARN</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="arn:aws:iam::123456789012:role/WebvarAgreementsAPI" />
                  </FormControl>
                  <FormDescription>
                    The Amazon Resource Name (ARN) of the IAM role created by the CloudFormation stack
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {verificationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>{verificationError}</AlertDescription>
              </Alert>
            )}

            {verificationSuccess && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle>Verification Successful</AlertTitle>
                <AlertDescription>Your AWS account has been successfully connected to Webvar!</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isVerifying || verificationSuccess} className="w-full">
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : verificationSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Verified
                </>
              ) : (
                'Verify IAM Role'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
