'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { offersApi } from '@/services/offers.api';
import { isvApi, } from '@/services/isv.api';
import { OfferStatus, ProductStatus, UserRole, Visibility } from '@/types';

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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getUsers } from '@/services';

// Form schema
const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  productId: z.string({ required_error: 'Please select a product' }),
  isPrivate: z.boolean(),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  duration: z.coerce.number().min(1, { message: 'Duration must be at least 1 day' }),
  discount: z.coerce.number().min(0).max(100).optional(),
  expirationDate: z.date().optional(),
  recipientId: z.string().optional(),
  status: z.nativeEnum(OfferStatus).optional(),
  awsOfferUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditOffer() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [isPrivate, setIsPrivate] = useState(true);
  
  // Get the offer ID from the URL
  const offerId = params.id as string;

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      isPrivate: true,
      price: 0,
      duration: 30,
      discount: 0,
    },
  });

  // Fetch offer details
  const { data: offer, isLoading: isLoadingOffer } = useQuery({
    queryKey: ['offer', offerId],
    queryFn: async () => {
      const response = await offersApi.getOffer(offerId);
      return response.data;
    },
  });

  // Fetch products/listings
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await isvApi.getProducts(1, 10, ProductStatus.PUBLISHED);
      return response.data;
    },
  });

  // Fetch users (for recipient selection)
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await getUsers({
        page: 1,
        limit: 10,
        role: UserRole.RESELLER,
      });
      return response.data;
    },
  });

  // Update form values when offer data is loaded
  useEffect(() => {
    if (offer) {
      form.reset({
        title: offer.title,
        description: offer.description || '',
        productId: offer.productId,
        isPrivate: offer.visibility === Visibility.PRIVATE,
        price: offer.price,
        duration: Number(offer.duration),
        discount: offer.discount || 0,
        expirationDate: offer.expirationDate ? new Date(offer.expirationDate) : undefined,
        recipientId: offer.recipientId,
        status: offer.status,
        awsOfferUrl: offer.awsOfferUrl,
      });
      setIsPrivate(offer.visibility === Visibility.PRIVATE);
    }
  }, [offer, form]);

  // Update offer mutation
  const updateMutation = useMutation({
    mutationFn: (data: FormValues) => offersApi.updateOffer(offerId, { ...data }),
    onSuccess: () => {
      toast.success('Offer updated successfully');
      queryClient.invalidateQueries({ queryKey: ['offer', offerId] });
      router.push(`/dashboard/offers/${offerId}`);
    },
    onError: (error: any) => {
      toast.error(`Failed to update offer: ${error.message}`);
    },
  });

  // Form submission handler
  const onSubmit = (values: FormValues) => {
    updateMutation.mutate(values);
  };

  // Handle back button
  const handleBack = () => {
    router.push(`/dashboard/offers/${offerId}`);
  };

  // Loading state
  if (isLoadingOffer || isLoadingProducts || isLoadingUsers) {
    return <EditOfferSkeleton />;
  }

  if (!offer) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h2 className="text-2xl font-bold mb-2">Offer not found</h2>
          <p className="text-muted-foreground mb-4">
            The offer you're trying to edit doesn't exist or you don't have permission to edit it.
          </p>
          <Button onClick={() => router.push('/dashboard/offers')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Offers
          </Button>
        </div>
      </div>
    );
  }

  // Check if the offer is in a state that can be edited
  const canEditAllFields = offer.status === OfferStatus.DRAFT;
  const isAcceptedOrDeclined = [OfferStatus.ACCEPTED, OfferStatus.DECLINED].includes(offer.status);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Edit Offer</h1>
          <Badge variant="success">{offer.status}</Badge>
        </div>
      </div>

      {isAcceptedOrDeclined && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-800">
            This offer has been {offer.status.toLowerCase()}. You can only update certain fields.
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update the basic details for your offer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter offer title" 
                            {...field} 
                            disabled={!canEditAllFields}
                          />
                        </FormControl>
                        <FormDescription>
                          A clear and concise title for your offer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your offer in detail"
                            className="min-h-[120px]"
                            {...field}
                            disabled={!canEditAllFields}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of what's included in this offer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Select the product this offer is for
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!canEditAllFields}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full md:w-[280px]">
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products?.data.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The product or service you're making an offer for
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {canEditAllFields && (
                <Card>
                  <CardHeader>
                    <CardTitle>AWS Integration</CardTitle>
                    <CardDescription>
                      Configure AWS Marketplace integration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="awsOfferUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AWS Offer URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter AWS Marketplace URL" 
                              {...field} 
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormDescription>
                            The URL to the offer in AWS Marketplace (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Offer Details</CardTitle>
                  <CardDescription>
                    Update the terms of your offer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {canEditAllFields && (
                    <>
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                step={0.01}
                                placeholder="0.00"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (days)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                placeholder="30"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              How long this offer is valid for after acceptance
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                placeholder="0"
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expirationDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Expiration Date</FormLabel>
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
                              When this offer expires if not accepted
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator className="my-4" />

                      <FormField
                        control={form.control}
                        name="isPrivate"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  setIsPrivate(!!checked);
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Private Offer</FormLabel>
                              <FormDescription>
                                This offer will only be visible to the selected recipient
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {isPrivate && (
                        <FormField
                          control={form.control}
                          name="recipientId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Recipient</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full md:w-[280px]">
                                    <SelectValue placeholder="Select a recipient" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {users?.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.name} ({user.email})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                The user who will receive this offer
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </>
                  )}

                  {offer.status !== OfferStatus.DRAFT && (
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full md:w-[280px]">
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(OfferStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Current status of the offer
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update Offer'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Skeleton loader for edit offer page
function EditOfferSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-6">
        <Skeleton className="h-9 w-20 mr-4" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[150px] w-full rounded-lg" />
        </div>
        
        <div className="space-y-6">
          <Skeleton className="h-[500px] w-full rounded-lg" />
          <div className="flex justify-end gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
