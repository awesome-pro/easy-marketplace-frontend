'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offersAwsApi, AwsOffer } from '@/services/offers-aws.api';
import { OfferStatus } from '@/types';
import { DataTable } from '@/components/data-table';
import { getOffersColumns } from './columns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface OffersAwsListProps {
  initialStatus?: OfferStatus;
  productId?: string;
  recipientId?: string;
}

export function OffersAwsList({ initialStatus, productId, recipientId }: OffersAwsListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Pagination and filtering state
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus || 'all');
  
  // Token-based pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [tokenStack, setTokenStack] = useState<string[]>([]);
  const [currentToken, setCurrentToken] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Fetch offers with token-based pagination
  const {
    data: awsOffersData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['offers-aws', currentToken, pageSize],
    queryFn: async () => {
      const response = await offersAwsApi.getOffers(currentToken, pageSize);
      
      // Store the next token for pagination
      setHasNextPage(!!response.data.nextToken);
      
      // Update total items count (approximate based on current page)
      if (currentPage === 1) {
        // If we're on the first page, set initial count
        setTotalItems(response.data.entities?.length * (response.data.nextToken ? 10 : 1));
      } else if (!response.data.nextToken) {
        // If we're on the last page, calculate more accurate total
        setTotalItems((currentPage - 1) * pageSize + (response.data.entities?.length || 0));
      }
      
      return {
        entities: response.data.entities || [],
        nextToken: response.data.nextToken
      };
    },
  });
  
  // Reset pagination when filters change
  useEffect(() => {
    if (statusFilter || productId || recipientId) {
      setCurrentPage(1);
      setCurrentToken(undefined);
      setTokenStack([]);
    }
  }, [statusFilter, productId, recipientId]);
  // Calculate pagination metadata for the UI
  const paginationMeta = useMemo(() => {
    // For client-side filtering, we can only estimate the total
    const estimatedTotal = totalItems || awsOffersData?.entities?.length || 0;
    const estimatedTotalPages = Math.max(currentPage, Math.ceil(estimatedTotal / pageSize));
    
    return {
      total: estimatedTotal,
      totalPages: estimatedTotalPages,
      currentPage,
      pageSize,
      hasNextPage,
      hasPreviousPage: currentPage > 1,
    };
  }, [currentPage, pageSize, hasNextPage, totalItems]);

  // Delete offer mutation
  const deleteMutation = useMutation({
    mutationFn: offersAwsApi.deleteOffer,
    onSuccess: () => {
      toast.success('Offer deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['offers-aws'] });
      setDeleteDialogOpen(false);
      setSelectedOfferId(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete offer: ${error.message}`);
    },
  });
  
  // Accept offer mutation
  const acceptMutation = useMutation({
    mutationFn: offersAwsApi.acceptOffer,
    onSuccess: () => {
      toast.success('Offer accepted successfully');
      queryClient.invalidateQueries({ queryKey: ['offers-aws'] });
      setAcceptDialogOpen(false);
      setSelectedOfferId(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to accept offer: ${error.message}`);
    },
  });

  // Decline offer mutation
  const declineMutation = useMutation({
    mutationFn: offersAwsApi.declineOffer,
    onSuccess: () => {
      toast.success('Offer declined successfully');
      queryClient.invalidateQueries({ queryKey: ['offers-aws'] });
      setDeclineDialogOpen(false);
      setSelectedOfferId(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to decline offer: ${error.message}`);
    },
  });

  // Handle view offer
  const handleViewOffer = (id: string) => {
    router.push(`/dashboard/offers/${id}`);
  };

  // Handle edit offer
  const handleEditOffer = (id: string) => {
    router.push(`/dashboard/offers/${id}/edit`);
  };

  // Handle delete offer
  const handleDeleteOffer = (id: string) => {
    setSelectedOfferId(id);
    setDeleteDialogOpen(true);
  };

  // Handle publish offer
  const handlePublishOffer = (id: string) => {
    setSelectedOfferId(id);
    setPublishDialogOpen(true);
  };

  // Handle accept offer
  const handleAcceptOffer = (id: string) => {
    setSelectedOfferId(id);
    setAcceptDialogOpen(true);
  };

  // Handle decline offer
  const handleDeclineOffer = (id: string) => {
    setSelectedOfferId(id);
    setDeclineDialogOpen(true);
  };

  // Handle refresh data
  const handleRefresh = () => {
    // Reset pagination and refetch from the beginning
    setCurrentPage(1);
    setCurrentToken(undefined);
    setTokenStack([]);
    refetch();
  };

  // Confirm delete offer
  const confirmDeleteOffer = () => {
    if (selectedOfferId) {
      deleteMutation.mutate(selectedOfferId);
    }
  };

  // Confirm accept offer
  const confirmAcceptOffer = () => {
    if (selectedOfferId) {
      acceptMutation.mutate(selectedOfferId);
    }
  };

  // Confirm decline offer
  const confirmDeclineOffer = () => {
    if (selectedOfferId) {
      declineMutation.mutate(selectedOfferId);
    }
  };

  // Get columns with action handlers
  const columns = getOffersColumns({
    onView: handleViewOffer,
    onEdit: handleEditOffer,
    onDelete: handleDeleteOffer,
    onAccept: handleAcceptOffer,
    onDecline: handleDeclineOffer,
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={awsOffersData?.entities || []}
        isLoading={isLoading}
        searchKey="title"
        onRefresh={refetch}
        refreshLoading={isLoading}
        searchLoading={isLoading && search.length > 0}
        serverPagination={{
          currentPage: paginationMeta.currentPage,
          pageSize: paginationMeta.pageSize,
          totalItems: paginationMeta.total,
          totalPages: paginationMeta.totalPages,
          hasNextPage: paginationMeta.hasNextPage,
          hasPreviousPage: paginationMeta.hasPreviousPage,
          nextToken: awsOffersData?.nextToken,
          tokenStack: tokenStack,
          onPageChange: (newPage) => {
            if (newPage > currentPage && hasNextPage) {
              // Going forward - use next token
              if (awsOffersData?.nextToken) {
                // Store current token in stack for going back later
                setTokenStack([...tokenStack, currentToken || '']);
                setCurrentToken(awsOffersData.nextToken);
                setCurrentPage(newPage);
              }
            } else if (newPage < currentPage) {
              // Going backward - pop from token stack
              if (currentPage > 1) {
                const newTokenStack = [...tokenStack];
                const previousToken = newTokenStack.pop();
                setTokenStack(newTokenStack);
                setCurrentToken(previousToken);
                setCurrentPage(newPage);
              }
            } else if (newPage === 1 && currentPage !== 1) {
              // Reset to first page
              setTokenStack([]);
              setCurrentToken(undefined);
              setCurrentPage(1);
            }
          },
          onPageSizeChange: (newPageSize) => {
            setPageSize(newPageSize);
            setCurrentPage(1);
            setCurrentToken(undefined);
            setTokenStack([]);
            setTotalItems(0);
          },
        }}
        toolbar={{
          searchPlaceholder: "Search offers...",
        }}
        onSearchChange={setSearch}
        searchValue={search}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the offer
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteOffer} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Accept Confirmation Dialog */}
      <AlertDialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Offer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept this offer? This will finalize the terms
              and notify the creator.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAcceptOffer}>
              Accept
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Decline Confirmation Dialog */}
      <AlertDialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline Offer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to decline this offer? This action cannot be undone
              and will notify the creator.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeclineOffer} className="bg-destructive text-destructive-foreground">
              Decline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
