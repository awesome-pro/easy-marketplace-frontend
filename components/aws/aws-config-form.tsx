'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { saveAwsConfig } from '@/services/aws.api';

// Zod schema for AWS configuration validation
const awsConfigSchema = z.object({
  s3BucketName: z.string().min(3, 'S3 bucket name is required and must be at least 3 characters'),
  s3Prefix: z.string().optional(),
  snsTopicArn: z.string()
    .min(20, 'SNS topic ARN is required')
    .regex(
      /^arn:aws:sns:[a-z0-9-]+:\d{12}:[a-zA-Z0-9-_]+$/,
      'Invalid SNS ARN format. Should be like: arn:aws:sns:region:account-id:topic-name'
    )
});

type AwsConfigFormValues = z.infer<typeof awsConfigSchema>;

export interface AwsConfigFormProps {
  onConfigSuccess: () => void;
  defaultValues?: {
    s3BucketName?: string;
    s3Prefix?: string;
    snsTopicArn?: string;
  };
}

export const AwsConfigForm: React.FC<AwsConfigFormProps> = ({
  onConfigSuccess,
  defaultValues = {}
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const form = useForm<AwsConfigFormValues>({
    resolver: zodResolver(awsConfigSchema),
    defaultValues: {
      s3BucketName: defaultValues.s3BucketName || '',
      s3Prefix: defaultValues.s3Prefix || '',
      snsTopicArn: defaultValues.snsTopicArn || ''
    }
  });

  const onSubmit = async (values: AwsConfigFormValues) => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Show verification in progress message
      setSaveError('Verifying AWS configuration resources. This may take a moment...');
      
      const response = await saveAwsConfig({
        s3BucketName: values.s3BucketName,
        s3Prefix: values.s3Prefix || '',
        snsTopicArn: values.snsTopicArn
      });

      // Clear the verification message
      setSaveError(null);

      if (response.success) {
        setSaveSuccess(true);
        setTimeout(() => {
          onConfigSuccess();
        }, 1500);
      } else {
        setSaveError(response.message || 'Failed to save AWS configuration. Please try again.');
      }
    } catch (error: any) {
      setSaveError(error.message || 'An error occurred while saving AWS configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-5">
        <CardTitle className="text-xl">AWS Configuration</CardTitle>
        <CardDescription>
          Provide additional AWS configuration details for data access
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5 space-y-6">
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle>Where to find these details</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-2">
              You can find these values in the AWS CloudFormation console:
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Go to the AWS CloudFormation console</li>
              <li>Select the stack you created</li>
              <li>Go to the "Outputs" tab</li>
              <li>Look for the "EasyMarketplaceS3Bucket", "EasyMarketplaceS3Prefix", and "EasyMarketplaceSNSTopic" keys and copy their values</li>
            </ol>
          </AlertDescription>
        </Alert>
        
        <Alert variant="default" className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertTitle>Important: Verification Process</AlertTitle>
          <AlertDescription className="mt-2">
            <p>
              When you submit this form, we'll verify that:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>The S3 bucket exists and is accessible</li>
              <li>The S3 prefix is valid and we have permission to write to it</li>
              <li>The SNS topic exists and is accessible</li>
            </ul>
            <p className="mt-2">
              This verification ensures that your AWS configuration is correctly set up for disbursement data processing.
            </p>
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="s3BucketName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>S3 Bucket Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="EasyMarketplace-data-bucket" />
                  </FormControl>
                  <FormDescription>
                    The name of the S3 bucket where your data will be stored
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="s3Prefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>S3 Prefix (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="data/" />
                  </FormControl>
                  <FormDescription>
                    The prefix for objects in your S3 bucket (e.g., "data/", "reports/")
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="snsTopicArn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SNS Topic ARN</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="arn:aws:sns:us-east-1:123456789012:EasyMarketplace-topic" />
                  </FormControl>
                  <FormDescription>
                    The Amazon Resource Name (ARN) of the SNS topic for notifications
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {saveError && (
              <Alert variant={saveError.includes('Verifying') ? 'default' : 'destructive'} 
                     className={saveError.includes('Verifying') ? 'bg-blue-50 border-blue-200' : ''}>
                {saveError.includes('Verifying') ? 
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> : 
                  <AlertCircle className="h-4 w-4" />}
                <AlertTitle>
                  {saveError.includes('Verifying') ? 'Verification In Progress' : 'Configuration Failed'}
                </AlertTitle>
                <AlertDescription>
                  {saveError}
                  {saveError.includes('bucket') && (
                    <p className="mt-2 text-sm">
                      Make sure the S3 bucket exists and your IAM role has permissions to access it.
                    </p>
                  )}
                  {saveError.includes('prefix') && (
                    <p className="mt-2 text-sm">
                      Make sure the S3 prefix is valid and your IAM role has permissions to list and write objects.
                    </p>
                  )}
                  {saveError.includes('SNS') && (
                    <p className="mt-2 text-sm">
                      Make sure the SNS topic ARN is correct and your IAM role has permissions to access it.
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {saveSuccess && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle>Configuration Successful</AlertTitle>
                <AlertDescription>Your AWS configuration has been saved successfully!</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isSaving || saveSuccess} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : (
                'Save Configuration'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
