'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/data-table';
import { getUserColumns } from './columns';
import { activateUser, deactivateUser, deleteUser, GetUsersParams } from '@/services/users.api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserRole } from '@/types/user';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { UserCardGrid } from './user-card-grid';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Table2 } from 'lucide-react';
import { useAuthContext } from '@/providers/auth-provider';

interface UserListProps {
  fetchUsers: (params: GetUsersParams) => Promise<any>;
  role: UserRole;
  title: string;
  createPath?: string;
  // Connection-related props
  showConnectionStatus?: boolean;
  onConnectionRequest?: (userId: string) => Promise<boolean>;
  onAcceptConnection?: (connectionId: string) => Promise<boolean>;
  onRejectConnection?: (connectionId: string) => Promise<boolean>;
}

export function UserList({ 
  fetchUsers, 
  role, 
  title, 
  createPath,
  showConnectionStatus = false,
  onConnectionRequest,
  onAcceptConnection,
  onRejectConnection
}: UserListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthContext()
  
  // State for pagination and filtering
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // State for view mode (table or grid)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid'); // Default to grid view
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms delay
    
    return () => clearTimeout(timer);
  }, [search]);
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Fetch users with pagination and filtering
  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ['users', role, page, pageSize, debouncedSearch],
    queryFn: () => fetchUsers({ 
      page, 
      limit: pageSize, 
      role, 
      search: debouncedSearch,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }),
  });
  
  // Handle manual refresh of data
  const handleRefreshData = useCallback(() => {
    refetch();
  }, [refetch]);
  
  // Update search loading state
  useEffect(() => {
    setIsSearching(isFetching && debouncedSearch !== '');
  }, [isFetching, debouncedSearch]);

  // Mutations for user actions
  const activateMutation = useMutation({
    mutationFn: activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', role] });
      toast.success("User activated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to activate user: ${error.message}`);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', role] });
      toast.success("User deactivated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to deactivate user: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', role] });
      toast.success("User deleted successfully");
      setDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete user: ${error.message}`);
      setDeleteDialogOpen(false);
    },
  });

  // Handler functions for user actions
  const handleViewUser = (id: string) => {
    router.push(`/dashboard/${role.toLowerCase()}s/${id}`);
  };

  const handleEditUser = (id: string) => {
    router.push(`/dashboard/${role.toLowerCase()}s/${id}/edit`);
  };

  const handleDeleteUser = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete);
    }
  };

  const handleActivateUser = (id: string) => {
    activateMutation.mutate(id);
  };

  const handleDeactivateUser = (id: string) => {
    deactivateMutation.mutate(id);
  };

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };
  
  // Handle search changes
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (value === '') {
      // If search is cleared, immediately reset
      setDebouncedSearch('');
    }
    // Reset to first page when searching
    setPage(1);
  }, []);

  // Create columns with action handlers
  const columns = getUserColumns({
    onView: handleViewUser,
    onEdit: handleEditUser,
    onDelete: handleDeleteUser,
    onActivate: handleActivateUser,
    onDeactivate: handleDeactivateUser,
  });

  return (
    <div className="space-y-4">
      {/* View Toggle Buttons */}
      <div className="flex justify-end mb-4">
        <div className="bg-muted p-1 rounded-md flex">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Grid</span>
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setViewMode('table')}
          >
            <Table2 className="h-4 w-4" />
            <span className="hidden sm:inline">Table</span>
          </Button>
        </div>
      </div>

      {/* Conditional Rendering Based on View Mode */}
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          error={error as Error}
          searchKey="name"
          toolbar={{
            searchPlaceholder: `Search ${title}...`,
            createLink: createPath,
            createButtonLabel: `Add ${title}`,
          }}
          serverPagination={
            data?.meta
              ? {
                  currentPage: data.meta.currentPage,
                  pageSize: data.meta.pageSize,
                  totalItems: data.meta.total,
                  totalPages: data.meta.totalPages,
                  hasNextPage: data.meta.hasNextPage,
                  hasPreviousPage: data.meta.hasPreviousPage,
                  onPageChange: handlePageChange,
                  onPageSizeChange: handlePageSizeChange,
                }
              : undefined
          }
          serverSideSearch={true}
          onSearchChange={handleSearchChange}
          searchValue={search}
          searchLoading={isSearching}
          onRefresh={handleRefreshData}
          refreshLoading={isFetching}
        />
      ) : (
        <UserCardGrid
          fetchUsers={fetchUsers}
          role={role}
          title={title}
          createPath={createPath}
          onView={handleViewUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onActivate={handleActivateUser}
          onDeactivate={handleDeactivateUser}
          data={data}
          isLoading={isLoading}
          error={error as Error}
          page={page}
          pageSize={pageSize}
          search={search}
          isSearching={isSearching}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearchChange={handleSearchChange}
          onRefresh={handleRefreshData}
          refreshLoading={isFetching}
          // Connection-related props
          showConnectionStatus={showConnectionStatus}
          onConnectionRequest={onConnectionRequest}
          onAcceptConnection={onAcceptConnection}
          onRejectConnection={onRejectConnection}
        />
      )}

      {/* Delete Confirmation Dialog - Only needed for table view as grid has its own */}
      {viewMode === 'table' && (
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
      )}
    </div>
  );
}
