'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { isvApi } from '@/services/isv.api';
import { BillingPeriod, ProductStatus, ProductVisibility } from '@/types';

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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { SelectButtons } from '@/components/select-button';

// Form schema
const formSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  visibility: z.nativeEnum(ProductVisibility),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  currency: z.string(),
  billingPeriod: z.nativeEnum(BillingPeriod),
  categories: z.array(z.string()).min(1, { message: 'Select at least one category' }),
  features: z.array(z.string()).min(1, { message: 'Add at least one feature' }),
  images: z.array(z.string()),
  status: z.nativeEnum(ProductStatus),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  
  // Get the product ID from the URL
  const productId = params.id as string;

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      visibility: ProductVisibility.PRIVATE,
      price: 0,
      currency: 'USD',
      billingPeriod: BillingPeriod.MONTHLY,
      categories: [],
      features: [],
      images: [],
    },
  });

  // Fetch product details
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await isvApi.getProduct(productId);
      return response.data;
    },
  });

  // Update form values when product data is loaded
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description || '',
        visibility: product.visibility,
        price: product.price,
        currency: product.currency || 'USD',
        billingPeriod: product.billingPeriod,
        categories: product.categories || [],
        features: product.features || [],
        images: product.images || [],
        status: product.status,
      });
      setCategories(product.categories || []);
      setFeatures(product.features || []);
    }
  }, [product, form]);

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: (data: FormValues) => isvApi.updateProduct(productId, { ...data }),
    onSuccess: () => {
      toast.success('Product listing updated successfully');
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      router.push(`/dashboard/listings/${productId}`);
    },
    onError: (error: any) => {
      toast.error(`Failed to update product listing: ${error.message}`);
    },
  });

  // Form submission handler
  const onSubmit = (values: FormValues) => {
    const productData = {
      ...values,
      categories: categories,
      features: features,
    };
    updateMutation.mutate(productData);
  };

  // Handle adding a new category
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      form.setValue('categories', updatedCategories);
      setNewCategory('');
    }
  };

  // Handle removing a category
  const handleRemoveCategory = (category: string) => {
    const updatedCategories = categories.filter(c => c !== category);
    setCategories(updatedCategories);
    form.setValue('categories', updatedCategories);
  };

  // Handle adding a new feature
  const handleAddFeature = () => {
    if (newFeature && !features.includes(newFeature)) {
      const updatedFeatures = [...features, newFeature];
      setFeatures(updatedFeatures);
      form.setValue('features', updatedFeatures);
      setNewFeature('');
    }
  };

  // Handle removing a feature
  const handleRemoveFeature = (feature: string) => {
    const updatedFeatures = features.filter(f => f !== feature);
    setFeatures(updatedFeatures);
    form.setValue('features', updatedFeatures);
  };

  // Handle back button
  const handleBack = () => {
    router.push(`/dashboard/listings/${productId}`);
  };

  // Loading state
  if (isLoadingProduct) {
    return <EditListingSkeleton />;
  }

  if (!product) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <p className="text-muted-foreground mb-4">
            The product you're trying to edit doesn't exist or you don't have permission to edit it.
          </p>
          <Button onClick={() => router.push('/dashboard/listings')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  // Check if the product is in a state that can be edited
  const canEditAllFields = [ProductStatus.DRAFT, ProductStatus.REJECTED].includes(product.status);
  const isPublished = product.status === ProductStatus.PUBLISHED;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Edit Product Listing</h1>
          <Badge variant={product.status === ProductStatus.PUBLISHED ? 'success' : 'secondary'}>
            {product.status}
          </Badge>
        </div>
      </div>

      {isPublished && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-800">
            This product is published. You can only update certain fields.
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
                    Update the basic details for your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter product name" 
                            {...field} 
                            disabled={!canEditAllFields}
                          />
                        </FormControl>
                        <FormDescription>
                          A clear and concise name for your product
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
                            placeholder="Describe your product in detail"
                            className="min-h-[120px]"
                            {...field}
                            disabled={!canEditAllFields}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of your product's features and benefits
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {canEditAllFields && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Categories</CardTitle>
                      <CardDescription>
                        Update categories to help customers find your product
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="flex-1"
                          />
                          <Button type="button" onClick={handleAddCategory}>
                            Add
                          </Button>
                        </div>

                        {categories.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {categories.map((category, index) => (
                              <div
                                key={index}
                                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md flex items-center gap-2"
                              >
                                <span>{category}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0"
                                  onClick={() => handleRemoveCategory(category)}
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm">
                            No categories added yet
                          </p>
                        )}
                        <FormField
                          control={form.control}
                          name="categories"
                          render={() => (
                            <FormItem>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Features</CardTitle>
                      <CardDescription>
                        Update key features of your product
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a feature"
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            className="flex-1"
                          />
                          <Button type="button" onClick={handleAddFeature}>
                            Add
                          </Button>
                        </div>

                        {features.length > 0 ? (
                          <div className="flex flex-col gap-2 mt-2">
                            {features.map((feature, index) => (
                              <div
                                key={index}
                                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md flex items-center justify-between"
                              >
                                <span>{feature}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0"
                                  onClick={() => handleRemoveFeature(feature)}
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm">
                            No features added yet
                          </p>
                        )}
                        <FormField
                          control={form.control}
                          name="features"
                          render={() => (
                            <FormItem>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Visibility</CardTitle>
                  <CardDescription>
                    Update pricing and visibility options
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
                            <FormLabel>Price</FormLabel>
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
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                <SelectItem value="INR">INR (₹)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <SelectButtons
                        control={form.control}
                        name="billingPeriod"
                        label="Billing Period"
                        options={BillingPeriod}
                        description="Categorize your user for easier organization"
                        gridCols={{ default: 1, sm: 2, md: 3, lg: 4 }}
                        />

                      <Separator className="my-4" />

                      <SelectButtons
                        control={form.control}
                        name="visibility"
                        label="Visibility"
                        options={ProductVisibility}
                        description="Categorize your user for easier organization"
                        gridCols={{ default: 1, sm: 2, md: 3, lg: 4 }}
                        />
                    </>
                  )}

                 <SelectButtons
                  control={form.control}
                  name="status"
                  label="Status"
                  options={ProductStatus}
                  description="Categorize your user for easier organization"
                  gridCols={{ default: 1, sm: 2, md: 3, lg: 4 }}
                  />
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
                  {updateMutation.isPending ? 'Updating...' : 'Update Product'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Skeleton loader for edit listing page
function EditListingSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-6">
        <Skeleton className="h-9 w-20 mr-4" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
        
        <div className="space-y-6">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="flex justify-end gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}