"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, RefreshCcw } from "lucide-react";
import { isvApi } from "@/services/isv.api";
import { Disbursement, DisbursementStatus } from "@/types";
import { type RowSelectionState } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Column definition
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { FaAws } from "react-icons/fa6";
import { useAuthContext } from "@/providers/auth-provider";
import Link from "next/link";

// Helper function to get badge variant based on disbursement status
const getStatusVariant = (status: DisbursementStatus) => {
  switch (status) {
    case DisbursementStatus.COMPLETED:
      return "success";
    case DisbursementStatus.PENDING:
      return "warning";
    case DisbursementStatus.PROCESSING:
      return "default";
    case DisbursementStatus.FAILED:
      return "destructive";
    default:
      return "secondary";
  }
};

export function DisbursementsListComponent() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<DisbursementStatus | undefined>(undefined);
  const { user } = useAuthContext();

  // Get query client for invalidating queries after mutation
  const queryClient = useQueryClient();
  
  // Fetch disbursements with pagination
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['disbursements', page, pageSize, statusFilter],
    queryFn: () => isvApi.getDisbursements(page, pageSize, statusFilter),
  });

  // Use mutation for the sync operation
  const { mutate: syncDisbursements, isPending: isSyncing } = useMutation({
    mutationFn: () => isvApi.syncDisbursements(),
    onSuccess: (data) => {
      toast.success(`Successfully synced ${data.data.count} disbursements`);
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Failed to sync disbursements: ${error.message}`);
    }
  });

  const onRefresh = () => {
    refetch().then(() => {
      toast.success("Disbursements refreshed successfully");
    });
  };

  // Handle download receipt
  const handleDownloadReceipt = (id: string) => {
    toast.info("Downloading receipt...");
    isvApi.downloadDisbursementReceipt(id)
      .then(() => {
        toast.success("Receipt downloaded successfully");
      })
      .catch((error) => {
        toast.error(`Error downloading receipt: ${error.message}`);
      });
  };

  // Handle view disbursement details
  const handleViewDisbursement = (id: string) => {
    // Navigate to disbursement details page
    window.open(`/dashboard/isv/disbursements/${id}`, "_blank");
  };

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setRowSelection({});
  };

  // Extract disbursements and pagination metadata from the response
  const disbursements = data?.data?.data || [];
  const paginationMeta = data?.data?.meta || {
    total: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  };

  // Define columns for the disbursements table
  const columns: ColumnDef<Disbursement>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reference ID" />
      ),
      cell: ({ row }) => (
        <div className="font-medium max-w-[150px] truncate">
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "period",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Period" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[150px]">
          {row.getValue("period")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as DisbursementStatus;
        return (
          <Badge variant={getStatusVariant(status)}>
            {status}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => {
        const disbursement = row.original;
        return (
          <div className="font-medium">
            {disbursement.currency} {disbursement.amount.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM d, yyyy"),
    },
    {
      accessorKey: "disbursedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Disbursed" />
      ),
      cell: ({ row }) => {
        const disbursedAt = row.getValue("disbursedAt");
        if (!disbursedAt) return <span className="text-muted-foreground">Pending</span>;
        return format(new Date(disbursedAt as string), "MMM d, yyyy");
      },
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => {
        const disbursement = row.original;
        const isCompleted = disbursement.status === DisbursementStatus.COMPLETED;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleViewDisbursement(disbursement.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              
              {isCompleted && (
                <DropdownMenuItem onClick={() => handleDownloadReceipt(disbursement.id)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Status filter component
  const StatusFilterButton = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8">
          <Filter className="mr-2 h-4 w-4" />
          Filter
          {statusFilter && statusFilter.length > 0 && (
            <span className="ml-1 rounded-full bg-primary w-4 h-4 text-[10px] flex items-center justify-center text-primary-foreground">
              {statusFilter.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const SyncButton = () => (
    <div>
      {
        user?.awsId ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto h-8 bg-orange-400 hover:bg-orange-500 text-white" 
            onClick={() => syncDisbursements()} 
            disabled={isSyncing || isLoading}
          >
            <FaAws className="mr-2 h-4 w-4" />
            {isSyncing ? 'Syncing with AWS...' : 'Sync with AWS'}
          </Button>
        ) : (
          <Link
            href="/dashboard/aws/onboarding"
            className="flex items-center ml-auto h-8 dark:bg-blue-600 bg-primary text-white rounded-full px-2" 
          >
            <FaAws className="mr-2 h-4 w-4" />
            Connect AWS to sync disbursements
          </Link>
        )
      }
    </div>
  );

  return (
    <Card className="p-4">
      <DataTable
        columns={columns}
        data={disbursements}
        isLoading={isLoading}
        error={error as Error}
        searchKey="id"
        rowSelection={true}
        defaultPageSize={pageSize}
        toolbar={{
          searchPlaceholder: "Search by reference ID...",
          additionalButtons: (<div className="flex items-center gap-2">
            <StatusFilterButton />
            <SyncButton />
          </div>),
        }}
        onRefresh={onRefresh}
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
      />
    </Card>
  );
}
