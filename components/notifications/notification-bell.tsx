"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { notificationsApi } from "@/services/notifications.api";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification, NotificationType } from "@/types";
import { format } from "date-fns";
import Link from "next/link";

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  // Fetch unread count
  const { data: unreadCountData, isLoading } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 15000, 
  });

  // Fetch recent notifications
  const { data: recentNotificationsData } = useQuery({
    queryKey: ['notifications-recent'],
    queryFn: () => notificationsApi.getNotifications(1, 5, true), // Get 5 unread notifications
    refetchInterval: 120000, // Refetch every 2 minutes
  });

  const unreadCount = unreadCountData?.data?.count || 0;
  const recentNotifications = recentNotificationsData?.data?.data || [];

  // Helper function to get badge color based on notification type
  const getNotificationTypeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER:
        return "bg-blue-500";
      case NotificationType.OFFER:
        return "bg-green-500";
      case NotificationType.DEAL:
        return "bg-amber-500";
      case NotificationType.SERVICE:
        return "bg-purple-500";
      case NotificationType.SYSTEM:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Render a single notification item
  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <Link href={`/dashboard/notifications/${notification.id}`} className="flex items-start gap-2 p-3 hover:bg-primary/10 hover:text-primary rounded-md transition-colors">
      <div className={cn("w-2 h-2 rounded-full mt-2", getNotificationTypeColor(notification.type))} />
      <div className="flex-1 space-y-1">
        <div className="font-medium">{notification.title}</div>
        <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(notification.createdAt), "MMM d, h:mm a")}
        </p>
      </div>
    </Link>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          
          {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
          ) : unreadCount > 0 ? (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          <Link 
            href="/dashboard/notifications" 
            className="text-xs text-primary hover:underline"
            onClick={() => setOpen(false)}
          >
            View all
          </Link>
        </div>
        <ScrollArea className="h-[300px]">
          {recentNotifications.length > 0 ? (
            recentNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              No unread notifications
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
