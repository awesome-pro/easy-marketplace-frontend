"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { notificationsApi } from "@/services/notifications.api";
import { getNotificationColumns } from "./columns";
import { NotificationType } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { type RowSelectionState } from "@tanstack/react-table";

export function NotificationList() {
  const [type, setType] = useState<NotificationType | undefined>();
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Fetch notifications
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notifications', page, pageSize, unreadOnly, type],
    queryFn: () => notificationsApi.getNotifications(page, pageSize, unreadOnly),
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      toast.success("Notification marked as read");
      refetch();
      setRowSelection({});
    },
    onError: (error: any) => {
      toast.error(`Error marking notification as read: ${error.message}`);
    }
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      refetch();
      setRowSelection({});
    },
    onError: (error: any) => {
      toast.error(`Error marking all notifications as read: ${error.message}`);
    }
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onSuccess: () => {
      toast.success("Notification deleted successfully");
      refetch();
      setRowSelection({});
    },
    onError: (error: any) => {
      toast.error(`Error deleting notification: ${error.message}`);
    }
  });

  // Handle single notification delete
  const handleDeleteNotification = (id: string) => {
    setNotificationToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm single notification delete
  const confirmDeleteNotification = () => {
    if (notificationToDelete) {
      deleteNotificationMutation.mutate(notificationToDelete);
      setDeleteDialogOpen(false);
      setNotificationToDelete(null);
    }
  };

  // Handle mark as read
  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setRowSelection({});
  };

  // Extract notifications and pagination metadata from the response
  const notifications = data?.data?.data || [];
  const paginationMeta = data?.data?.meta || {
    total: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  };

  // Mark all as read button
  const MarkAllAsReadButton = () => (
    <Button 
      variant="outline" 
      onClick={handleMarkAllAsRead}
      className="flex items-center"
      size="sm"
    >
      <Check className="mr-2 h-4 w-4" />
      Mark All as Read
    </Button>
  );

  return (
    <>
      <Card className="p-4">
        <DataTable
          columns={getNotificationColumns({ 
            onDelete: handleDeleteNotification,
            onMarkAsRead: handleMarkAsRead,
          })}
          data={notifications}
          isLoading={isLoading}
          error={error as Error}
          searchKey="title"
          rowSelection={true}
          defaultPageSize={pageSize}
          toolbar={{
            searchPlaceholder: "Search notifications...",
          }}
          onRowSelectionChange={setRowSelection}
          rowSelectionState={rowSelection}
          additionalToolbarContent={<MarkAllAsReadButton />}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the notification.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteNotification}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
