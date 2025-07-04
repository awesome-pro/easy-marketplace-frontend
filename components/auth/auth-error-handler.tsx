import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Mail, Lock, AlertTriangle, Shield, RefreshCw } from 'lucide-react';

interface AuthErrorHandlerProps {
  errorCode: string;
  errorMessage?: string;
  email?: string;
  onRetry?: () => void;
}

/**
 * Component to handle and display authentication-related errors with appropriate UI and actions
 */
export function AuthErrorHandler({ errorCode, errorMessage, email, onRetry }: AuthErrorHandlerProps) {
  const router = useRouter();
  
  // Default error message if none provided
  const message = errorMessage || 'An error occurred during authentication';
  
  // Configure UI based on error type
  let icon = <AlertCircle className="h-10 w-10 text-destructive" />;
  let title = 'Authentication Error';
  let description = message;
  let primaryAction = (
    <Button variant="default" onClick={() => router.push('/auth/sign-in')}>
      Return to Sign In
    </Button>
  );
  let secondaryAction = null;
  
  // Handle specific error types
  switch (errorCode) {
    case 'PENDING_VERIFICATION':
      icon = <Mail className="h-10 w-10 text-amber-500" />;
      title = 'Email Verification Required';
      description = 'Please verify your email address to continue. Check your inbox for a verification link.';
      primaryAction = (
        <Button variant="default" onClick={() => router.push(`/auth/resend-verification?email=${encodeURIComponent(email || '')}`)}>
          Resend Verification Email
        </Button>
      );
      secondaryAction = (
        <Button variant="outline" onClick={() => router.push('/auth/sign-in')}>
          Try Different Account
        </Button>
      );
      break;
      
    case 'ACCOUNT_LOCKED':
      icon = <Lock className="h-10 w-10 text-destructive" />;
      title = 'Account Temporarily Locked';
      description = 'Your account has been temporarily locked due to too many failed login attempts. Please try again later or reset your password.';
      primaryAction = (
        <Button variant="default" onClick={() => router.push('/auth/forgot-password')}>
          Reset Password
        </Button>
      );
      secondaryAction = (
        <Button variant="outline" onClick={() => router.push('/auth/sign-in')}>
          Return to Sign In
        </Button>
      );
      break;
      
    case 'ACCOUNT_SUSPENDED':
      icon = <AlertTriangle className="h-10 w-10 text-destructive" />;
      title = 'Account Suspended';
      description = 'Your account has been suspended. Please contact support for assistance.';
      primaryAction = (
        <Button variant="default" onClick={() => router.push('/contact-support')}>
          Contact Support
        </Button>
      );
      break;
      
    case 'ACCOUNT_INACTIVE':
      icon = <AlertCircle className="h-10 w-10 text-amber-500" />;
      title = 'Account Inactive';
      description = 'Your account is currently inactive. Please contact support to reactivate your account.';
      primaryAction = (
        <Button variant="default" onClick={() => router.push('/contact-support')}>
          Contact Support
        </Button>
      );
      break;
      
    case 'TWO_FACTOR_REQUIRED':
      icon = <Shield className="h-10 w-10 text-primary" />;
      title = 'Two-Factor Authentication Required';
      description = 'Please enter your two-factor authentication code to continue.';
      primaryAction = (
        <Button variant="default" onClick={() => router.push('/auth/two-factor')}>
          Enter 2FA Code
        </Button>
      );
      break;
      
    case 'INVALID_CREDENTIALS':
      icon = <AlertCircle className="h-10 w-10 text-destructive" />;
      title = 'Invalid Credentials';
      description = 'The email or password you entered is incorrect. Please try again.';
      primaryAction = (
        <Button variant="default" onClick={onRetry || (() => router.push('/auth/sign-in'))}>
          Try Again
        </Button>
      );
      secondaryAction = (
        <Button variant="outline" onClick={() => router.push('/auth/forgot-password')}>
          Forgot Password?
        </Button>
      );
      break;
      
    case 'NETWORK_ERROR':
      icon = <RefreshCw className="h-10 w-10 text-amber-500" />;
      title = 'Connection Error';
      description = 'There was a problem connecting to the server. Please check your internet connection and try again.';
      primaryAction = (
        <Button variant="default" onClick={onRetry || (() => window.location.reload())}>
          Retry
        </Button>
      );
      break;
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex items-center">
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Additional content can be added here if needed */}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {primaryAction}
        {secondaryAction && <div className="w-full">{secondaryAction}</div>}
      </CardFooter>
    </Card>
  );
}

export default AuthErrorHandler;
