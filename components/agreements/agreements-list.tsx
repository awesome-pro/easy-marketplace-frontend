'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/data-table';
import { getAgreementsColumns } from './columns';
import { useQuery } from '@tanstack/react-query';
import { agreementsApi } from '@/services/agreements.api';
import { AwsAgreement } from '@/types/aws-agreement';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface AgreementsListProps {
  filter?: 'buyer' | 'seller' | 'all';
}

export function AgreementsList({ filter = 'all' }: AgreementsListProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredData, setFilteredData] = useState<AwsAgreement[]>([]);
  const [paginatedData, setPaginatedData] = useState<AwsAgreement[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch all agreements at once
  const { data: allAgreements, isLoading, error, refetch } = useQuery({
    queryKey: ['agreements', filter],
    queryFn: async () => {
      // Get all agreements without pagination parameters
      const response = await agreementsApi.getAgreementsAsProposer()
      return response;
    },
  });

  // Filter data based on search term
  useEffect(() => {
    if (!allAgreements) return;
    
    setSearchLoading(true);
    
    // Debounce search
    const timer = setTimeout(() => {
      const searchTerm = search.toLowerCase().trim();
      
      if (!searchTerm) {
        setFilteredData(allAgreements);
      } else {
        const filtered = allAgreements.filter((agreement: AwsAgreement) => {
          // Search in multiple fields
          return (
            agreement.agreementId?.toLowerCase().includes(searchTerm) ||
            agreement.agreementType?.toLowerCase().includes(searchTerm) ||
            agreement.proposalSummary?.offerId?.toLowerCase().includes(searchTerm) ||
            agreement.proposalSummary?.resources?.[0]?.id?.toLowerCase().includes(searchTerm) ||
            agreement.proposalSummary?.resources?.[0]?.type?.toLowerCase().includes(searchTerm) ||
            agreement.acceptor?.accountId?.toLowerCase().includes(searchTerm) ||
            agreement.status?.toLowerCase().includes(searchTerm)
          );
        });
        setFilteredData(filtered);
      }
      
      setPage(1); // Reset to first page when search changes
      setSearchLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search, allAgreements]);

  // Update total items count
  useEffect(() => {
    if (filteredData) {
      setTotalItems(filteredData.length);
    }
  }, [filteredData]);

  // Paginate data
  useEffect(() => {
    if (!filteredData) return;
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedData(filteredData.slice(startIndex, endIndex));
  }, [filteredData, page, pageSize]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  // Handle row click
  const handleRowClick = (agreement: AwsAgreement) => {
    router.push(`/dashboard/agreements/${agreement.agreementId}`);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  // Handle agreement actions
  const handleView = (id: string) => {
    router.push(`/dashboard/agreements/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/agreements/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this agreement?')) {
      agreementsApi.deleteAgreement(id)
        .then(() => {
          toast.success('Agreement deleted successfully');
          refetch(); // Refresh the list after deletion
        })
        .catch((error) => {
          toast.error(`Failed to delete agreement: ${error.message}`);
        });
    }
  };

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this agreement?')) {
      agreementsApi.updateAgreement(id, { status: "CANCELLED" })
        .then(() => {
          toast.success('Agreement canceled successfully');
          refetch(); // Refresh the list after cancellation
        })
        .catch((error) => {
          toast.error(`Failed to cancel agreement: ${error.message}`);
        });
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Agreements refreshed');
    } catch (error: any) {
      toast.error(`Failed to refresh agreements: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSync = async () => {
    try {
      await agreementsApi.syncAgreements();
      refetch();
      toast.success('Agreements synced');
    } catch (error: any) {
      toast.error(`Failed to sync agreements: ${error.message}`);
    }
  };

  const columns = getAgreementsColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onCancel: handleCancel,
  });

  // Server pagination props for the DataTable
  const serverPagination = {
    currentPage: page,
    pageSize: pageSize,
    totalItems: totalItems,
    totalPages: totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
  };

  return (
    <DataTable
      columns={columns}
      data={paginatedData || []}
      isLoading={isLoading}
      error={error as Error}
      onRowClick={handleRowClick}
      onRefresh={handleRefresh}
      refreshLoading={refreshing}
      additionalToolbarContent={
        <Button
          onClick={handleSync}
          disabled={isLoading}
          variant="outline"
        >
          Sync Agreements
        </Button>
      }
      serverPagination={serverPagination}
      onSearchChange={handleSearchChange}
      searchValue={search}
      searchLoading={searchLoading}
      toolbar={{
        searchPlaceholder: 'Search agreements...',
      }}
    />
  );
}
