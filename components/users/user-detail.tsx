import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { UserRole, UserStatus, ConnectionStatus } from '@/types/user';
import { format } from 'date-fns';
import { Mail, Building, Calendar, CheckCircle, XCircle, User } from 'lucide-react';
import { FaAws } from 'react-icons/fa';
import { requestConnection, acceptConnection, rejectConnection, cancelConnectionRequest } from '@/services/connections.api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/auth-provider';

// Helper function to get badge variant based on user status
const getStatusVariant = (status: UserStatus) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return "success";
    case UserStatus.INACTIVE:
      return "secondary";
    case UserStatus.SUSPENDED:
      return "destructive";
    case UserStatus.DELETED:
      return "outline";
    case UserStatus.TRIAL_ENDED:
      return "warning";
    default:
      return "default";
  }
};

// Helper function to get badge variant based on user role
const getRoleVariant = (role: UserRole) => {
  switch (role) {
    case UserRole.ISV:
      return "default";
    case UserRole.RESELLER:
      return "secondary";
    case UserRole.DISTRIBUTOR:
      return "outline";
    case UserRole.BUYER:
      return "success";
    default:
      return "default";
  }
};

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

interface UserDetailProps {
  user: any;
  isLoading: boolean;
  error: any;
  roleSpecificContent?: React.ReactNode;
  connectionStatus?: ConnectionStatus;
  connectionId?: string;
  user1Id?: string;
  user2Id?: string;
}

export function UserDetail({ 
  user, 
  isLoading, 
  error, 
  roleSpecificContent,
  connectionStatus,
  connectionId,
  user1Id,
  user2Id
}: UserDetailProps) {
  const router = useRouter();
  const { user: currentUser } = useAuthContext();

  const handleConnectionRequest = async () => {
    try {
      await requestConnection(user.id);
      toast.success('Connection request sent successfully');
      router.refresh();
    } catch (error: any) {
      toast.error(`Failed to send connection request: ${error.message}`);
    }
  };

  const handleAcceptConnection = async () => {
    if (!connectionId) return;
    try {
      await acceptConnection(connectionId);
      toast.success('Connection accepted successfully');
      router.refresh();
    } catch (error: any) {
      toast.error(`Failed to accept connection: ${error.message}`);
    }
  };

  const handleRejectConnection = async () => {
    if (!connectionId) return;
    try {
      await rejectConnection(connectionId);
      toast.success('Connection rejected successfully');
      router.refresh();
    } catch (error: any) {
      toast.error(`Failed to reject connection: ${error.message}`);
    }
  };

  const handleCancelConnectionRequest = async () => {
    if (!connectionId) return;
    try {
      await cancelConnectionRequest(connectionId);
      toast.success('Connection request cancelled successfully');
      router.refresh();
    } catch (error: any) {
      toast.error(`Failed to cancel connection request: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="relative h-60 w-full rounded-lg overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-8 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:w-2/3 space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading User</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error.message || 'Failed to load user details'}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested user could not be found.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Determine if we should show connection actions
  const showConnectionActions = currentUser?.id !== user.id && 
    ((currentUser?.role === UserRole.ISV && user.role === UserRole.RESELLER) || 
     (currentUser?.role === UserRole.RESELLER && user.role === UserRole.ISV));

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="relative h-60 w-full rounded-lg overflow-hidden">
        {user.coverImage ? (
          <img 
            src={user.coverImage} 
            alt={`${user.name}'s cover`} 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
        )}
        
        {/* User Role Badge */}
        <div className="absolute top-4 right-4">
          <Badge variant={getRoleVariant(user.role)} className="text-sm px-3 py-1">
            {user.role}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Profile Info */}
        <div className="md:w-1/3 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar and Name */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-primary/10">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.jobTitle || user.role}</p>
                </div>
              </div>

              <Separator />

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={getStatusVariant(user.status)}>
                  {user.status}
                </Badge>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.company}</span>
                </div>
                {user.awsId && (
                  <div className="flex items-center gap-2">
                    <FaAws className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">AWS Connected</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Membership Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined {format(new Date(user.createdAt), "MMMM d, yyyy")}</span>
                </div>
                {user.emailVerified && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Verified Account</span>
                  </div>
                )}
              </div>

              {/* Connection Actions */}
              {showConnectionActions && (
                <>
                  <Separator />
                  <div className="pt-2">
                    {connectionStatus ? (
                      connectionStatus === ConnectionStatus.ACCEPTED || connectionStatus === ConnectionStatus.AUTHORIZED ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Connection</span>
                          <Badge variant="success">Connected</Badge>
                        </div>
                      ) : connectionStatus === ConnectionStatus.PENDING ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Connection</span>
                            <Badge variant="warning">Pending</Badge>
                          </div>
                          {
                            user2Id == currentUser?.id ? (
                              <div className='flex flex-col gap-2'>
                                <Button 
                                  variant="success" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={handleAcceptConnection}
                                >
                                  Accept
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={handleRejectConnection}
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={handleCancelConnectionRequest}
                              >
                                Cancel Request
                              </Button>
                            )
                          }
                        </div>
                      ) : connectionStatus === ConnectionStatus.REJECTED ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Connection</span>
                            <Badge variant="destructive">Rejected</Badge>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={handleConnectionRequest}
                          >
                            Try Again
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Connection</span>
                          <Badge variant="outline">{connectionStatus}</Badge>
                        </div>
                      )
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full"
                        onClick={handleConnectionRequest}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Role Specific Content */}
        <div className="md:w-2/3 space-y-4">
          {roleSpecificContent ? (
            roleSpecificContent
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {user.name} is a {user.role.toLowerCase()} at {user.company}.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
