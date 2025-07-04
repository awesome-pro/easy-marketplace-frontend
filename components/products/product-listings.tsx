import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { listingsApi } from '@/services/listings.api';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { debounce }from 'lodash'

function getVisibilityBadgeVariant(visibility: string): "default" | "success" | "outline" | "destructive" | "secondary" {
  switch (visibility) {
    case 'Public':
      return 'default';
    case 'Limited':
      return 'success';
    case 'Draft': 
      return 'outline';
    case 'Restricted':
      return 'destructive';
    default:
      return 'default';
  }
}

// Define columns for the data table
const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'Name',
    header: 'Product Name',
    cell: ({ row }) => <div className="font-medium">{row.original.Name}</div>,
  },
  {
    accessorKey: 'EntityType',
    header: 'Type',
    cell: ({ row }) => <Badge variant="default">{row.original.EntityType}</Badge>,
  },
  {
    accessorKey: 'Visibility',
    header: 'Visibility',
    cell: ({ row }) => <Badge variant={getVisibilityBadgeVariant(row.original.Visibility)}>{row.original.Visibility}</Badge>,
  },
  {
    accessorKey: 'LastModifiedDate',
    header: 'Last Modified',
    cell: ({ row }) => <div>{new Date(row.original.LastModifiedDate).toLocaleDateString()}</div>,
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/listings/${row.original.EntityId}`)}
          >
            View
          </Button>
        </div>
      );
    },
  },
];

export function ProductListings() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [nextToken, setNextToken] = useState<string | undefined>(undefined);
  const [pageTokens, setPageTokens] = useState<(string | undefined)[]>([undefined]);
  const pageSize = 10;

  // Product types to fetch
  const productTypes = ['SaaSProduct', 'AmiProduct', 'ContainerProduct', 'DataProduct'];

  // Fetch product listings from the API
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['product-listings', productTypes, nextToken, debouncedSearch],
    queryFn: () => listingsApi.getListings({
      productTypes,
      nextToken,
      maxResults: pageSize,
      search: debouncedSearch || undefined,
    }),
  });

  // Create debounced search function
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
      // Reset pagination when search changes
      setCurrentPage(1);
      setNextToken(undefined);
      setPageTokens([undefined]);
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > currentPage && data?.nextToken) {
      // Going forward
      if (page > pageTokens.length) {
        setPageTokens([...pageTokens, data.nextToken]);
      }
      setNextToken(data.nextToken);
    } else if (page < currentPage) {
      // Going backward
      setNextToken(pageTokens[page - 1]);
    }
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      {/* <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
      </div> */}

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.items || []}
          serverPagination={{
            currentPage: currentPage,
            pageSize: pageSize,
            totalItems: data?.items?.length || 0,
            totalPages: data?.nextToken ? currentPage + 1 : currentPage,
            hasNextPage: !!data?.nextToken,
            hasPreviousPage: currentPage > 1,
            onPageChange: handlePageChange
          }}
        />
      )}
    </div>
  );
}
