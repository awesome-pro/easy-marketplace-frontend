'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import authApi from '@/services/auth.api';


export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const { mutate: resendVerificationEmail, isPending } = useMutation({
    mutationFn: () => authApi.resendVerificationEmail(email),
    onSuccess: (data) => {
      if (data.data.success) {
        toast.success('Verification email sent successfully');
        setIsEmailSent(true);
      } else {
        toast.error(data.data.message || 'Failed to send verification email');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'An error occurred while sending verification email');
    }
  });
  
  const handleResendEmail = () => {
    if (!email) {
      toast.error('Email address is required');
      return;
    }
    
    resendVerificationEmail();
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex items-center">
          {isEmailSent ? (
            <CheckCircle className="h-12 w-12 text-primary mb-4" />
          ) : (
            <Mail className="h-12 w-12 text-primary mb-4" />
          )}
          <CardTitle className="text-xl">
            {isEmailSent ? 'Verification Email Sent' : 'Email Verification Required'}
          </CardTitle>
          <CardDescription className="text-center">
            {isEmailSent 
              ? 'We\'ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.'
              : 'Your account requires email verification before you can sign in. Please check your inbox for a verification link or request a new one.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {email && (
            <div className="text-center text-muted-foreground mb-4">
              <span className="font-medium text-foreground">{email}</span>
            </div>
          )}
          <div className="text-sm text-muted-foreground text-center mt-2">
            {isEmailSent 
              ? 'If you don\'t see the email in your inbox, please check your spam folder.'
              : 'If you don\'t see the verification email in your inbox, click the button below to resend it.'}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {isEmailSent ? (
            <Link href="/auth/sign-in" className="w-full">
              <Button variant="default" className="w-full">
                Return to Sign In
              </Button>
            </Link>
          ) : (
            <Button 
              variant="default" 
              className="w-full" 
              onClick={handleResendEmail}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Resend Verification Email
            </Button>
          )}
          <Link href="/auth/sign-in" className="w-full">
            <Button variant="outline" className="w-full">
              Try Different Account
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
