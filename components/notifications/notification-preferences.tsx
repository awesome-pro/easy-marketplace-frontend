"use client";

import React, { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notificationsApi } from "@/services/notifications.api";
import { NotificationChannel, NotificationType } from "@/types";
import { Loader2 } from "lucide-react";

export function NotificationPreferences() {
  // Fetch notification preferences
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => notificationsApi.getNotificationPreferences(),
  });

  // Initialize default preferences if none exist
  const initializePreferencesMutation = useMutation({
    mutationFn: () => notificationsApi.initializeDefaultPreferences(),
    onSuccess: () => {
      toast.success("Notification preferences initialized");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Error initializing preferences: ${error.message}`);
    }
  });

  // Update preference mutation
  const updatePreferenceMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => 
      notificationsApi.updateNotificationPreference(id, { enabled }),
    onSuccess: () => {
      toast.success("Preference updated");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Error updating preference: ${error.message}`);
      refetch(); // Refetch to reset UI state
    }
  });

  // Check if preferences exist, if not initialize them
  useEffect(() => {
    if (data?.data && data.data.length === 0) {
      initializePreferencesMutation.mutate();
    }
  }, [data]);

  // Group preferences by notification type
  const preferencesByType = React.useMemo(() => {
    if (!data?.data) return {};
    
    return data.data.reduce((acc, pref) => {
      if (!acc[pref.type]) {
        acc[pref.type] = [];
      }
      acc[pref.type].push(pref);
      return acc;
    }, {} as Record<string, typeof data.data>);
  }, [data]);

  // Handle toggle change
  const handleToggleChange = (id: string, enabled: boolean) => {
    updatePreferenceMutation.mutate({ id, enabled });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading notification preferences: {(error as Error).message}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Configure how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="in-app">In-App</TabsTrigger>
            <TabsTrigger value="push">Push</TabsTrigger>
          </TabsList>
          
          {Object.values(NotificationChannel).map((channel) => (
            <TabsContent key={channel} value={channel.toLowerCase()}>
              <div className="space-y-6">
                {Object.entries(preferencesByType).map(([type, preferences]) => {
                  const preference = preferences.find(p => p.channel === channel);
                  if (!preference) return null;
                  
                  return (
                    <div key={`${type}-${channel}`} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor={preference.id}>{type} Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive {channel.toLowerCase()} notifications for {type.toLowerCase()} updates
                        </p>
                      </div>
                      <Switch
                        id={preference.id}
                        checked={preference.enabled}
                        onCheckedChange={(checked) => handleToggleChange(preference.id, checked)}
                      />
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
