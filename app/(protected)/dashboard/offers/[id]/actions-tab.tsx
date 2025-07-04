'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AwsOffer } from '@/services/offers-aws.api';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { offersAwsApi } from '@/services/offers-aws.api';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, Download, RefreshCw, Trash2, X } from 'lucide-react';
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
import { mapAwsStateToOfferStatus } from '@/utils/aws-offer-mapper';
import { OfferStatus } from '@/types';

interface ActionsTabProps {
  offer: any;
}

export function ActionsTab({ offer }: ActionsTabProps) {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);

  // Map AWS state to our application status
  const offerStatus = mapAwsStateToOfferStatus(offer.State!);

  // Delete offer mutation
  const deleteMutation = useMutation({
    mutationFn: offersAwsApi.deleteOffer,
    onSuccess: () => {
      toast.success('Offer deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['offer-aws', offer.EntityId] });
      setDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete offer: ${error.message}`);
    },
  });

  // Publish offer mutation
  const publishMutation = useMutation({
    mutationFn: offersAwsApi.publishOffer,
    onSuccess: () => {
      toast.success('Offer published successfully');
      queryClient.invalidateQueries({ queryKey: ['offer-aws', offer.EntityId] });
      setPublishDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to publish offer: ${error.message}`);
    },
  });

  // Accept offer mutation
  const acceptMutation = useMutation({
    mutationFn: offersAwsApi.acceptOffer,
    onSuccess: () => {
      toast.success('Offer accepted successfully');
      queryClient.invalidateQueries({ queryKey: ['offer-aws', offer.EntityId] });
      setAcceptDialogOpen(false);
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
      queryClient.invalidateQueries({ queryKey: ['offer-aws', offer.EntityId] });
      setDeclineDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to decline offer: ${error.message}`);
    },
  });

  // Sync offer mutation
  const syncMutation = useMutation({
    mutationFn: offersAwsApi.syncOffer,
    onSuccess: () => {
      toast.success('Offer synced with AWS successfully');
      queryClient.invalidateQueries({ queryKey: ['offer-aws', offer.EntityId] });
      setSyncDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to sync offer with AWS: ${error.message}`);
    },
  });

  // Handle delete offer
  const handleDeleteOffer = () => {
    setDeleteDialogOpen(true);
  };

  // Handle publish offer
  const handlePublishOffer = () => {
    setPublishDialogOpen(true);
  };

  // Handle accept offer
  const handleAcceptOffer = () => {
    setAcceptDialogOpen(true);
  };

  // Handle decline offer
  const handleDeclineOffer = () => {
    setDeclineDialogOpen(true);
  };

  // Handle sync offer
  const handleSyncOffer = () => {
    setSyncDialogOpen(true);
  };

  // Confirm delete offer
  const confirmDeleteOffer = () => {
    deleteMutation.mutate(offer.EntityId);
  };

  // Confirm publish offer
  const confirmPublishOffer = () => {
    publishMutation.mutate(offer.EntityId);
  };

  // Confirm accept offer
  const confirmAcceptOffer = () => {
    acceptMutation.mutate(offer.EntityId);
  };

  // Confirm decline offer
  const confirmDeclineOffer = () => {
    declineMutation.mutate(offer.EntityId);
  };

  // Confirm sync offer
  const confirmSyncOffer = () => {
    syncMutation.mutate(offer.EntityId);
  };

  // Download offer JSON
  const handleDownloadOfferJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(offer, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `offer-${offer.EntityId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success('Offer JSON downloaded');
  };

  return (
    <div className="space-y-6">
      {/* Offer Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Offer Actions</CardTitle>
          <CardDescription>
            Manage this offer with the available actions below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status-based actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Publish Action */}
            {offerStatus === OfferStatus.DRAFT && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Publish Offer</CardTitle>
                  <CardDescription>Make this offer available to recipients</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    onClick={handlePublishOffer}
                    disabled={publishMutation.isPending}
                    className="w-full"
                  >
                    {publishMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>Publish Offer</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Accept Action */}
            {/* {offerStatus === OfferStatus.RELEASED && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Accept Offer</CardTitle>
                  <CardDescription>Accept the terms of this offer</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    onClick={handleAcceptOffer}
                    disabled={acceptMutation.isPending}
                    className="w-full"
                    variant="default"
                  >
                    {acceptMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Accepting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept Offer
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )} */}

            {/* Decline Action */}
            {/* {offerStatus === OfferStatus.RELEASED && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Decline Offer</CardTitle>
                  <CardDescription>Decline the terms of this offer</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    onClick={handleDeclineOffer}
                    disabled={declineMutation.isPending}
                    className="w-full"
                    variant="destructive"
                  >
                    {declineMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Declining...
                      </>
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Decline Offer
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )} */}

            {/* Delete Action */}
            {/* {offerStatus === OfferStatus.DRAFT && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Delete Offer</CardTitle>
                  <CardDescription>Permanently remove this offer</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    onClick={handleDeleteOffer}
                    disabled={deleteMutation.isPending}
                    className="w-full"
                    variant="destructive"
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Offer
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )} */}
          </div>

          {/* General actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Download JSON Action */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Download JSON</CardTitle>
                <CardDescription>Download offer data as JSON file</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  onClick={handleDownloadOfferJson}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download JSON
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}
