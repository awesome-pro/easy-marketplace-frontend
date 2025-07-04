"use client";

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useEffect, useState } from 'react'
import { useAuthContext } from '@/providers/auth-provider';
import EstateLoading from '@/components/loading';
import { UserStatus } from '@/types/user';
import { useRouter, usePathname } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileUploadProvider } from '@/contexts/file-upload-context';
import { IconExclamationCircle } from '@tabler/icons-react';
import { TopBar } from '@/components/top-bar';
import { AwsAuthDialog } from '@/components/aws/aws-auth-dialog';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <FileUploadProvider>
        {/* <NotificationProvider> */}
          <SidebarProvider
            style={{
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
          >
            {children}
          </SidebarProvider>
        {/* </NotificationProvider> */}
      </FileUploadProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

// Component to display status-specific alerts with actions
function StatusAlert({ status, onAction }: { status: UserStatus, onAction: () => void }) {
  const messages = {
    [UserStatus.ACTIVE]: {
      title: '',
      description: '',
      action: '',
      redirect: ''
    },
    [UserStatus.DELETED]: {
      title: 'Account Deleted',
      description: 'Your account has been deleted. Please contact support for assistance.',
      action: 'Contact Support',
      redirect: '/deleted'
    },
    [UserStatus.TRIAL_ENDED]: {
      title: 'Trial Ended',
      description: 'Your trial period has ended. Please renew your subscription to continue.',
      action: 'Renew Subscription',
      redirect: '/subscription/inactive'
    },
    [UserStatus.SUSPENDED]: {
      title: 'Account Suspended',
      description: 'Your account has been suspended. Please contact support for assistance.',
      action: 'Contact Support',
      redirect: '/suspended'
    },
    [UserStatus.INACTIVE]: {
      title: 'Account Inactive',
      description: 'Your account is currently inactive. Please reactivate your account to continue.',
      action: 'Reactivate Account',
      redirect: '/inactive'
    }
  };

  const statusInfo = messages[status];

  return (
    <Alert variant="destructive" className="max-w-md mx-auto mt-8">
      <IconExclamationCircle className="h-4 w-4" />
      {/* <AlertTitle>{statusInfo.title}</AlertTitle> */}
      <AlertDescription className="mt-2">
        {/* <p className="mb-4">{statusInfo.description}</p> */}
        <Button onClick={onAction} variant="destructive">
          {/* {statusInfo.action} */} Test
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isInitialized } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [showAwsAuthDialog, setShowAwsAuthDialog] = useState(false);

  // Handle user status redirects
  useEffect(() => {
    if (user && user.status !== UserStatus.ACTIVE) {
      const redirectMap = {
        [UserStatus.SUSPENDED]: '/suspended',
        [UserStatus.INACTIVE]: '/inactive',
        [UserStatus.TRIAL_ENDED]: '/trial-ended',
        [UserStatus.DELETED]: '/deleted'
      };
      
      const redirectPath = redirectMap[user.status];
      if (redirectPath) {
        router.push(redirectPath);
      }
    }
  }, [user, router]);

  // Show loading state
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <EstateLoading />
      </div>
    );
  }

  // Handle unauthenticated users
  if (!user) {
    router.push('/auth/sign-in');
    return (
      <div className="flex items-center justify-center h-screen">
        <EstateLoading />
      </div>
    );
  }

  // Handle non-active users with status alerts
  if (user.status !== UserStatus.ACTIVE) {
    debugger;
    const handleStatusAction = () => {
      const redirectMap = {
        [UserStatus.ACTIVE]: '/dashboard',
        [UserStatus.SUSPENDED]: '/suspended',
        [UserStatus.INACTIVE]: '/inactive',
        [UserStatus.TRIAL_ENDED]: '/trial-ended',
        [UserStatus.DELETED]: '/deleted'
      };
      
      const redirectPath = redirectMap[user.status];
      if (redirectPath) {
        router.push(redirectPath);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <StatusAlert status={user.status} onAction={handleStatusAction} />
      </div>
    );
  }

  // Check if user needs AWS authentication setup
  useEffect(() => {
    if (user && user.status === UserStatus.ACTIVE && !user.awsId && pathname && !pathname.includes('/dashboard/aws/onboarding')) {
      setShowAwsAuthDialog(true);
    }
  }, [user, pathname]);

  // Only active users can access protected content
  return (
    <Providers>
      <AppSidebar variant="inset" />
      <main className="w-full">
        <TopBar />
        <div className="h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
      {user && <AwsAuthDialog 
        isOpen={showAwsAuthDialog} 
        onClose={() => setShowAwsAuthDialog(false)} 
        currentPath={pathname || ''} 
      />}
    </Providers>
  );
}

export default DashboardLayout
