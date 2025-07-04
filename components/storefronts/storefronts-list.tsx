'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/data-table';
import { getStorefrontsColumns } from './columns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storefrontsApi } from '@/services/storefronts.api';
import { toast } from 'sonner';

interface StorefrontsListProps {
  resellerId?: string;
}

export function StorefrontsList({ resellerId }: StorefrontsListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch storefront products
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['storefrontProducts', page, pageSize, search, resellerId],
    queryFn: async () => {
      const params: any = { page, limit: pageSize };
      
      if (search) params.search = search;
      if (resellerId) params.resellerId = resellerId;
      
      return storefrontsApi.getStorefrontProducts(params);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: storefrontsApi.removeProductFromStorefront,
    onSuccess: () => {
      toast.success('Product removed from storefront successfully');
      queryClient.invalidateQueries({ queryKey: ['storefrontProducts'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to remove product: ${error.message}`);
    },
  });

  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { isVisible: boolean } }) => 
      storefrontsApi.updateStorefrontProduct(id, data),
    onSuccess: () => {
      toast.success('Product visibility updated successfully');
      queryClient.invalidateQueries({ queryKey: ['storefrontProducts'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update visibility: ${error.message}`);
    },
  });

  // Handle row click
  const handleRowClick = (storefrontProduct: any) => {
    router.push(`/dashboard/storefronts/${storefrontProduct.id}`);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchLoading(true);
    setSearch(value);
    
    // Debounce search
    const timer = setTimeout(() => {
      setPage(1);
      setSearchLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  };

  // Handle storefront product actions
  const handleView = (id: string) => {
    router.push(`/dashboard/storefronts/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/storefronts/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this product from your storefront?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleVisibility = (id: string, isVisible: boolean) => {
    toggleVisibilityMutation.mutate({ 
      id, 
      data: { isVisible } 
    });
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Storefront products refreshed');
    } catch (error: any) {
      toast.error(`Failed to refresh products: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const columns = getStorefrontsColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggleVisibility: handleToggleVisibility,
  });

  return (
    <DataTable
      columns={columns}
      data={data?.data.data || []}
      isLoading={isLoading}
      error={error as Error}
      searchKey="product.name"
      onRowClick={handleRowClick}
      onRefresh={handleRefresh}
      refreshLoading={refreshing}
      serverPagination={{
        currentPage: page,
        pageSize: pageSize,
        totalItems: data?.data.meta?.total || 0,
        totalPages: data?.data.meta?.totalPages || 1,
        hasNextPage: data?.data.meta?.hasNextPage || false,
        hasPreviousPage: data?.data.meta?.hasPreviousPage || false,
        onPageChange: setPage,
        onPageSizeChange: setPageSize,
      }}
      serverSideSearch={true}
      onSearchChange={handleSearchChange}
      searchValue={search}
      searchLoading={searchLoading}
      toolbar={{
        searchPlaceholder: 'Search storefront products...',
        createLink: '/dashboard/storefronts/new',
        createButtonLabel: 'Add Product',
      }}
    />
  );
}
