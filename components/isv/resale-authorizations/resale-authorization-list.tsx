"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { getResaleAuthorizationColumns } from "./columns";
import { getResellerAuthorizationColumns } from "./reseller-columns";
import { ResaleAuthorizationStatus } from "@/types/resale-authorization";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { type RowSelectionState } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getResaleAuthorizations, activateResaleAuthorization, cancelResaleAuthorization } from "@/services/resale-authorizations.api";
import { useAuthContext } from "@/providers/auth-provider";

export function ResaleAuthorizationList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [authorizationToCancel, setAuthorizationToCancel] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<ResaleAuthorizationStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const { user } = useAuthContext();

  // Fetch all resale authorizations at once
  const { data: allAuthorizations, isLoading, error, refetch } = useQuery({
    queryKey: ['resale-authorizations'],
    queryFn: () => getResaleAuthorizations(),
  });

  // Activate authorization mutation
  const activateAuthorizationMutation = useMutation({
    mutationFn: (id: string) => activateResaleAuthorization(id),
    onSuccess: () => {
      toast.success("Resale authorization activated successfully");
      queryClient.invalidateQueries({ queryKey: ['resale-authorizations'] });
      setRowSelection({});
    },
    onError: (error: any) => {
      toast.error(`Error activating resale authorization: ${error.message}`);
    }
  });

  // Cancel authorization mutation
  const cancelAuthorizationMutation = useMutation({
    mutationFn: (id: string) => cancelResaleAuthorization(id),
    onSuccess: () => {
      toast.success("Resale authorization cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ['resale-authorizations'] });
      setRowSelection({});
    },
    onError: (error: any) => {
      toast.error(`Error cancelling resale authorization: ${error.message}`);
    }
  });

  // Handle cancel authorization
  const handleCancelAuthorization = (id: string) => {
    setAuthorizationToCancel(id);
    setCancelDialogOpen(true);
  };

  // Confirm cancel authorization
  const confirmCancelAuthorization = () => {
    if (authorizationToCancel) {
      cancelAuthorizationMutation.mutate(authorizationToCancel);
      setCancelDialogOpen(false);
      setAuthorizationToCancel(null);
    }
  };

  // Handle view authorization
  const handleViewAuthorization = (id: string) => {
    router.push(`/dashboard/resale-authorizations/${id}`);
  };

  // Handle activate authorization
  const handleActivateAuthorization = (id: string) => {
    activateAuthorizationMutation.mutate(id);
  };

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setRowSelection({});
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchLoading(true);
    setSearchTerm(value);
    // Reset to first page when search changes
    setPage(1);
    
    // Simulate a slight delay to show loading state
    setTimeout(() => {
      setSearchLoading(false);
    }, 300);
  };

  // Filter and paginate data client-side
  const filteredData = useMemo(() => {
    if (!allAuthorizations) return [];
    
    return allAuthorizations
      .filter(auth => {
        // Filter by status if any status filter is applied
        if (statusFilter.length > 0) {
          const authStatus = auth.ResaleAuthorizationSummary.Status;
          // Check if the current auth status matches any of the selected status filters
          const statusMatch = statusFilter.some(selectedStatus => {
            // Convert AWS status to match our enum if needed
            return authStatus === selectedStatus;
          });
          
          if (!statusMatch) return false;
        }
        
        // Filter by search term if any
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            auth.Name?.toLowerCase().includes(searchLower) ||
            auth.ResaleAuthorizationSummary?.ProductName?.toLowerCase().includes(searchLower) ||
            auth.ResaleAuthorizationSummary?.ResellerLegalName?.toLowerCase().includes(searchLower) ||
            auth.ResaleAuthorizationSummary?.ManufacturerLegalName?.toLowerCase().includes(searchLower) ||
            auth.EntityId?.toLowerCase().includes(searchLower)
          );
        }
        
        return true;
      });
  }, [allAuthorizations, statusFilter, searchTerm]);
  
  // Calculate pagination
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, page, pageSize]);
  
  // Calculate pagination metadata
  const paginationMeta = useMemo(() => {
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    return {
      total: totalItems,
      pageSize,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };
  }, [filteredData, page, pageSize]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success("Resale authorizations refreshed");
    } catch (error: any) {
      toast.error(`Error refreshing resale authorizations: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  // Status filter component
  const StatusFilterButton = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8">
          <Filter className="mr-2 h-4 w-4" />
          Filter
          {statusFilter.length > 0 && (
            <span className="ml-1 rounded-full bg-primary w-4 h-4 text-[10px] flex items-center justify-center text-primary-foreground">
              {statusFilter.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.values(ResaleAuthorizationStatus).map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={statusFilter.includes(status)}
            onCheckedChange={(checked) => {
              if (checked) {
                setStatusFilter([...statusFilter, status]);
              } else {
                setStatusFilter(statusFilter.filter((s) => s !== status));
              }
              setPage(1); // Reset to first page when filter changes
            }}
          >
            {status}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <Card className="p-4">
        <DataTable
          columns={user?.role === 'RESELLER' ? getResellerAuthorizationColumns({ 
            onView: handleViewAuthorization,
            onActivate: handleActivateAuthorization,
            onCancel: handleCancelAuthorization,
          }) : getResaleAuthorizationColumns({ 
            onView: handleViewAuthorization,
            onActivate: handleActivateAuthorization,
            onCancel: handleCancelAuthorization,
          })}
          data={paginatedData || []}
          isLoading={isLoading}
          error={error as Error}
          searchKey="name"
          rowSelection={true}
          defaultPageSize={pageSize}
          toolbar={{
            searchPlaceholder: "Search authorizations...",
            additionalButtons: [
              <StatusFilterButton key="status-filter" />,
            ],
          }}
          onRefresh={handleRefresh}
          refreshLoading={refreshing}
          onRowSelectionChange={setRowSelection}
          rowSelectionState={rowSelection}
          serverPagination={{
            currentPage: paginationMeta.currentPage,
            pageSize: paginationMeta.pageSize,
            totalItems: paginationMeta.total,
            totalPages: paginationMeta.totalPages,
            hasNextPage: paginationMeta.hasNextPage,
            hasPreviousPage: paginationMeta.hasPreviousPage,
            onPageChange: handlePageChange,
          }}
          // We're handling search client-side but using the server pagination UI
          serverSideSearch={true}
          onSearchChange={handleSearch}
          searchValue={searchTerm}
          searchLoading={searchLoading}
        />
      </Card>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the resale authorization. The reseller will no longer be able to resell this product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelAuthorization}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Authorization
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
