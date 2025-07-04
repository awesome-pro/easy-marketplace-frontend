'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserResponse, GetUsersParams } from '@/services/users.api';
import { UserRole, UserStatus } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, CheckCircle, XCircle, Search, UserPlus, RefreshCw } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { PaginatedResponse } from '@/utils/pagination';
import { useAuthContext } from '@/providers/auth-provider';
import { ConnectionStatus } from '@/types/connection';

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

interface UserCardGridProps {
  fetchUsers: (params: GetUsersParams) => Promise<PaginatedResponse<UserResponse>>;
  role: UserRole;
  title: string;
  createPath?: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  data?: PaginatedResponse<UserResponse>;
  isLoading: boolean;
  error?: Error | null;
  page: number;
  pageSize: number;
  search: string;
  isSearching: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (value: string) => void;
  onRefresh?: () => void;
  refreshLoading?: boolean;
  // Connection-related props
  showConnectionStatus?: boolean;
  onConnectionRequest?: (userId: string) => Promise<boolean>;
  onAcceptConnection?: (connectionId: string) => Promise<boolean>;
  onRejectConnection?: (connectionId: string) => Promise<boolean>;
}

export function UserCardGrid({
  fetchUsers,
  role,
  title,
  createPath,
  onView,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  data,
  isLoading,
  error,
  pageSize,
  search,
  isSearching,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onRefresh,
  refreshLoading = false,
  showConnectionStatus = false,
  onConnectionRequest,
  onAcceptConnection,
  onRejectConnection,
}: UserCardGridProps) {
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { user } = useAuthContext()

  const handleDeleteUser = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const getConnectionStatusVariant = (status: ConnectionStatus) => {
    switch (status) {
      case ConnectionStatus.ACCEPTED:
        return "success";
      case ConnectionStatus.PENDING:
        return "warning";
      case ConnectionStatus.REJECTED:
        return "destructive";
      default:
        return "default";
    }
  };

  const confirmDelete = () => {
    if (userToDelete) {
      onDelete(userToDelete);
      setDeleteDialogOpen(false);
    }
  };

  // Calculate grid columns based on screen size
  const gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className="space-y-6">
      {/* Enhanced Search and Actions Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-4 rounded-lg shadow-sm">
        <div className="w-full md:w-auto flex-1 flex justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${title} by name, email, or company...`}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-4 w-full h-10"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={refreshLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
          {createPath && (
            <Button asChild>
              <Link href={createPath}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add {title}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p>Error: {error.message}</p>
        </div>
      )}

      {/* User Cards Grid */}
      {isLoading ? (
        <div className={`grid ${gridCols} gap-4`}>
          {Array.from({ length: pageSize }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {data?.data && data.data.length > 0 ? (
            <div className={`grid ${gridCols} gap-4`}>
              {data.data.map((user) => (
                <Card key={user.id} className="overflow-hidden hover:shadow-lg hover:z-10 transition-shadow cursor-pointer" onClick={() => onView(user.id)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 border">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-lg">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.company || "—"}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <p className="text-sm truncate">{user.email}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={getRoleVariant(user.role as UserRole)}>
                          {user.role}
                        </Badge>
                        <Badge variant={getStatusVariant(user.status as UserStatus)}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <p className="text-xs text-muted-foreground">
                      Joined {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </p>
                    {showConnectionStatus ? (
                      <div>
                        {user.connectionStatus ? (
                          <Badge variant={getConnectionStatusVariant(user.connectionStatus)} className="text-xs">
                            {user.connectionStatus}
                          </Badge>
                        ) : (
                          // No connection yet
                          onConnectionRequest ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-xs"
                              onClick={() => onConnectionRequest(user.id)}
                            >
                              Connect
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Not Connected
                            </Badge>
                          )
                        )}
                      </div>
                    ) : (
                      // Show standard status button if not showing connection status
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          if (user.status === UserStatus.ACTIVE) {
                            // Already active
                          } else {
                            onActivate(user.id);
                          }
                        }}
                      >
                        {user.status === UserStatus.ACTIVE ? "Active" : "Activate"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-card rounded-lg">
              <p className="text-muted-foreground mb-4">No users found</p>
              {user?.role === UserRole.ADMIN && createPath && (
                <Button asChild>
                  <Link href={createPath}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add {title}
                  </Link>
                </Button>
              )}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {data?.meta && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-card p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">
            Showing {((data.meta.currentPage - 1) * data.meta.pageSize) + 1} to {Math.min(data.meta.currentPage * data.meta.pageSize, data.meta.total)} of {data.meta.total} users
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(data.meta.currentPage - 1)}
                disabled={!data.meta.hasPreviousPage}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, data.meta.totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageToShow = data.meta.currentPage - 2 + i;
                  if (pageToShow <= 0) pageToShow = i + 1;
                  if (pageToShow > data.meta.totalPages) return null;
                  
                  return (
                    <Button
                      key={pageToShow}
                      variant={pageToShow === data.meta.currentPage ? "default" : "outline"}
                      size="sm"
                      className="w-9 h-9 p-0"
                      onClick={() => onPageChange(pageToShow)}
                    >
                      {pageToShow}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(data.meta.currentPage + 1)}
                disabled={!data.meta.hasNextPage}
              >
                Next
              </Button>
            </div>
            <select
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
