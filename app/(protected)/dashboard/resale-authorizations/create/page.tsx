'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { createResaleAuthorization } from '@/services/resale-authorizations.api';
import { ResellerSelector } from '@/components/entity-selector/reseller-selector';
import { User } from '@/types';

// UI Components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { listingsApi } from '@/services/listings.api';
import { Badge } from '@/components/ui/badge';

// Form schema
const formSchema = z.object({
  productId: z.string({ required_error: 'Please select a product' }),
  resellerId: z.string({ required_error: 'Please select a reseller' }),
  name: z.string().optional(),
  availabilityEndDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateResaleAuthorization() {
  const router = useRouter();
  
  // State to store the selected product and reseller objects
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedReseller, setSelectedReseller] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    },
  });

  // Fetch products/listings
    const { data: products, isLoading: isLoadingProducts } = useQuery({
      queryKey: ['products'],
      queryFn: async () => {
        const response = await listingsApi.getListings({
          productTypes: ['SaaSProduct', 'AmiProduct', 'ContainerProduct', 'DataProduct'],
          maxResults: 50,
        });
        return response.items;
      },
    });

  // Create resale authorization mutation
  const createMutation = useMutation({
    mutationFn: (data: FormValues) => {
      // Format the date to ISO string if it exists
      const formattedData = {
        productId: data.productId,
        resellerId: data.resellerId,
        name: data.name,
        availabilityEndDate: data.availabilityEndDate
      };
      
      console.log('Creating resale authorization with data:', formattedData);
      return createResaleAuthorization(formattedData);
    },
    onSuccess: (data: string) => {
      console.log('Resale authorization initialized successfully:', data);
      toast.success(`Resale authorization initialized successfully: ${data}`);
      router.push('/dashboard/resale-authorizations');
    },
    onError: (error: any) => {
      toast.error(`Failed to create resale authorization: ${error.message}`);
    },
  });

  // Form submission handler
  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Create New Resale Authorization</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Main content */}
            <div className="">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Provide the basic details for your resale authorization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Authorization Name (Optional)</FormLabel>
                        <FormControl>
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter a name for this authorization"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A descriptive name to help identify this authorization
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availabilityEndDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expiration Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          When this authorization expires. If not set, it will not expire.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        {
                          isLoadingProducts ? (
                            <Badge className='text-center w-full items-center justify-center py-1'>
                              Loading Products...
                            </Badge>
                          ) : (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products?.map((product) => (
                              <SelectItem key={product.EntityId} value={product.EntityId}>
                                {product.Name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                          )
                        }
                        <FormDescription>
                          The product or service you're making an offer for
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="resellerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reseller</FormLabel>
                        <FormControl>
                          <ResellerSelector
                            value={field.value}
                            onChange={(value, reseller) => {
                              field.onChange(value);
                              setSelectedReseller(reseller);
                            }}
                            selectedReseller={selectedReseller}
                            triggerClassName="w-full"
                          />
                        </FormControl>
                        <FormDescription>
                          The reseller you want to authorize to sell this product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard/resale-authorizations')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Authorization'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
        </form>
      </Form>
    </div>
  );
}

// Skeleton loader for create resale authorization page
function CreateResaleAuthorizationSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-6">
        <Skeleton className="h-9 w-20 mr-4" />
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
        
        <div className="space-y-6">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <div className="flex justify-end gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}