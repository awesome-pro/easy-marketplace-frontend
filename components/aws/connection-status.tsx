'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { AwsConnectionStatus } from '@/types/aws';
import { disconnectAwsAccount } from '@/services/aws.api';
import { useRouter } from 'next/navigation';

export interface ConnectionStatusProps {
  status: AwsConnectionStatus | null;
  isLoading: boolean;
  onDisconnect?: () => void;
  onRetry?: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  isLoading,
  onDisconnect,
  onRetry
}) => {
  const router = useRouter();
  const [isDisconnecting, setIsDisconnecting] = React.useState(false);

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect your AWS account? This will remove access to AWS Marketplace features.')) {
      return;
    }

    setIsDisconnecting(true);
    try {
      await disconnectAwsAccount();
      if (onDisconnect) {
        onDisconnect();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Error disconnecting AWS account:', error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-500">Checking AWS connection status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Unable to retrieve AWS connection status. Please try again later.
              {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
                  Retry
                </Button>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status.connected ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>AWS Account Connected</span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-gray-400" />
              <span>AWS Account Not Connected</span>
            </>
          )}
        </CardTitle>
        <CardDescription>
          {status.connected
            ? `Your AWS account (${status.accountId}) is connected to Webvar`
            : 'Connect your AWS account to use Webvar with AWS Marketplace'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status.connected ? (
          <div className="space-y-4">
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Connected Successfully</AlertTitle>
              <AlertDescription>
                Your AWS account is properly connected to Webvar. You can now use all AWS Marketplace features.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="font-medium">AWS Account ID:</span>
              <span>{status.accountId}</span>
            </div>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Required</AlertTitle>
            <AlertDescription>
              To use AWS Marketplace features, you need to connect your AWS account to Webvar.
              Follow the onboarding process to set up the connection.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {status.connected ? (
          <Button variant="outline" onClick={handleDisconnect} disabled={isDisconnecting}>
            {isDisconnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Disconnecting...
              </>
            ) : (
              'Disconnect AWS Account'
            )}
          </Button>
        ) : (
          <Button onClick={() => router.push('/dashboard/aws/onboarding')}>
            Connect AWS Account
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
