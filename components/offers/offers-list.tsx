'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offersApi } from '@/services/offers.api';
import { Offer, OfferStatus } from '@/types';
import { DataTable } from '@/components/data-table';
import { getOffersColumns } from './columns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Cloud, RefreshCw } from 'lucide-react';
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
import { FaAws } from 'react-icons/fa';

interface OffersListProps {
  status?: OfferStatus;
  listingId?: string;
  recipientId?: string;
}

export function OffersList({ status, listingId, recipientId }: OffersListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Fetch offers
  const {
    data: offersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['offers', page, pageSize, status, listingId, recipientId, search],
    queryFn: async () => {
      const response = await offersApi.getOffers(
        page,
        pageSize,
        status,
        listingId,
        recipientId,
        search
      );
      return response.data;
    },
  });

  // Delete offer mutation
  const deleteMutation = useMutation({
    mutationFn: offersApi.deleteOffer,
    onSuccess: () => {
      toast.success('Offer deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      setDeleteDialogOpen(false);
      setSelectedOfferId(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete offer: ${error.message}`);
    },
  });

  // Publish offer mutation
  const publishMutation = useMutation({
    mutationFn: offersApi.publishOffer,
    onSuccess: () => {
      toast.success('Offer published successfully');
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      setPublishDialogOpen(false);
      setSelectedOfferId(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to publish offer: ${error.message}`);
    },
  });

  // Accept offer mutation
  const acceptMutation = useMutation({
    mutationFn: offersApi.acceptOffer,
    onSuccess: () => {
      toast.success('Offer accepted successfully');
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      setAcceptDialogOpen(false);
      setSelectedOfferId(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to accept offer: ${error.message}`);
    },
  });

  // Decline offer mutation
  const declineMutation = useMutation({
    mutationFn: offersApi.declineOffer,
    onSuccess: () => {
      toast.success('Offer declined successfully');
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      setDeclineDialogOpen(false);
      setSelectedOfferId(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to decline offer: ${error.message}`);
    },
  });

  // Sync single offer mutation
  const syncOfferMutation = useMutation({
    mutationFn: offersApi.syncOffer,
    onSuccess: () => {
      toast.success('Offer synced with AWS successfully');
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      setSyncDialogOpen(false);
      setSelectedOfferId(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to sync offer with AWS: ${error.message}`);
    },
  });

  // Sync all offers mutation
  const syncAllOffersMutation = useMutation({
    mutationFn: offersApi.syncOffers,
    onSuccess: (data) => {
      const { message, count, failed } = data.data;
      toast.success(`Synced ${count} offers with AWS successfully`);
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      setIsSyncingAll(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to sync offers with AWS: ${error.message}`);
      setIsSyncingAll(false);
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

  // Handle sync offer
  const handleSyncOffer = (id: string) => {
    setSelectedOfferId(id);
    setSyncDialogOpen(true);
  };

  // Handle sync all offers
  const handleSyncAllOffers = () => {
    setIsSyncingAll(true);
    syncAllOffersMutation.mutate();
  };

  // Confirm delete offer
  const confirmDeleteOffer = () => {
    if (selectedOfferId) {
      deleteMutation.mutate(selectedOfferId);
    }
  };

  // Confirm publish offer
  const confirmPublishOffer = () => {
    if (selectedOfferId) {
      publishMutation.mutate(selectedOfferId);
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

  // Confirm sync offer
  const confirmSyncOffer = () => {
    if (selectedOfferId) {
      syncOfferMutation.mutate(selectedOfferId);
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
        data={offersData?.data || []}
        isLoading={isLoading}
        searchKey="title"
        serverSideSearch={true}
        additionalToolbarContent={
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleSyncAllOffers}
            disabled={isSyncingAll}
          >
            {isSyncingAll ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Syncing with AWS...
              </>
            ) : (
              <>
                <FaAws className="h-4 w-4" />
                Sync All with AWS
              </>
            )}
          </Button>
        }
        searchValue={search}
        onSearchChange={setSearch}
        serverPagination={{
          currentPage: page,
          pageSize: pageSize,
          totalItems: offersData?.meta.total || 0,
          totalPages: offersData?.meta.totalPages || 0,
          hasNextPage: page < (offersData?.meta.totalPages || 0),
          hasPreviousPage: page > 1,
          onPageChange: (newPage) => setPage(newPage),
          onPageSizeChange: setPageSize
        }}
        toolbar={{
          searchPlaceholder: "Search offers..."
        }}
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

      {/* Publish Confirmation Dialog */}
      <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Offer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish this offer? Once published, it will be
              visible to the recipient and they will be able to accept or decline it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPublishOffer}>
              Publish
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

      {/* Sync Confirmation Dialog */}
      <AlertDialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sync with AWS Marketplace</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sync this offer with AWS Marketplace? 
              This will update the offer status and details based on AWS data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSyncOffer}>
              Sync
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
