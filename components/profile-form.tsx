"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { settingsApi } from "@/services/settings.api";
import { UpdateProfileSettingsDto } from "@/types";
import { Badge } from "./ui/badge";
import { useAuthContext } from "@/providers/auth-provider";

// Form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  jobTitle: z.string().optional(),
  awsMarketplaceId: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuthContext();

  // Fetch profile settings
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile-settings'],
    queryFn: () => settingsApi.getProfileSettings(),
  });

  // Update profile settings mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileSettingsDto) => settingsApi.updateProfileSettings(data),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(`Error updating profile: ${error.message}`);
    }
  });

  // Set up form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      jobTitle: "",
      awsMarketplaceId: "",
    },
  });

  // Update form values when data is loaded
  useEffect(() => {
    if (data?.data) {
      const profileData = data.data;
      form.reset({
        name: profileData.name || "",
        email: profileData.email || "",
        company: profileData.company || "",
        awsMarketplaceId: profileData.awsMarketplaceId || "",
        jobTitle: profileData.jobTitle || "",
        
      });
    }
  }, [data, form]);

  // Handle form submission
  function onSubmit(values: ProfileFormValues) {
    updateProfileMutation.mutate({
      name: values.name,
      email: values.email,
      company: values.company,
      jobTitle: values.jobTitle,
      awsMarketplaceId: values.awsMarketplaceId,
    });
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-500 p-4">
            Error loading profile: {(error as Error).message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
       <div className="flex flex-col space-y-1">
        <CardTitle className="text-lg font-semibold">Profile Information</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Update your account profile information
        </CardDescription>
       </div>
       <Badge variant="success">{user?.role}</Badge>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your full name" 
                      {...field} 
                      disabled={!isEditing} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email" 
                      type="email" 
                      {...field} 
                      disabled={!isEditing} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your company name" 
                      {...field} 
                      disabled={!isEditing} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your job title" 
                      {...field} 
                      disabled={!isEditing} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="awsMarketplaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AWS Marketplace ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your AWS Marketplace ID" 
                      {...field} 
                      disabled={!isEditing} 
                    />
                  </FormControl>
                  <FormDescription>
                    This ID is used to identify your listings on AWS Marketplace.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            {isEditing ? (
              <>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </>
            ) : (
              <Button 
                type="button" 
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
