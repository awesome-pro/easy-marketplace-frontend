"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/profile-form";
import { SecurityForm } from "@/components/security-form";
import { NotificationPreferences } from "@/components/notifications/notification-preferences";

export function SettingsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <ProfileForm />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <SecurityForm />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationPreferences />
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-4">
          <div className="bg-muted/50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Subscription Management</h3>
            <p className="text-muted-foreground mb-4">
              Manage your subscription plan and billing information
            </p>
            <p className="text-sm text-muted-foreground">
              You are currently on the <span className="font-medium">30-day Free Trial</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Your trial ends on {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
