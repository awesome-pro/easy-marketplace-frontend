'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { offersApi } from '@/services/offers.api';
import { getUsers, isvApi } from '@/services';

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
import { BillingPeriod, EulaType, PricingType, SupportTermType, UsageTermType, UserRole, Visibility } from '@/types';
import { Switch } from '@/components/ui/switch';
import { SelectButtons } from '@/components/select-button';
import DatePicker from '@/components/ui/date-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { listingsApi } from '@/services/listings.api';
import { useState } from 'react';

enum PaymentSchedule {
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  ANNUALLY = 'Annually',
  UPFRONT = 'Upfront',
}

const rateCardsSchema = z.object({
  dimensionKey: z.string(),
  price: z.string(),
})

enum ContractType {
  FIXED = 'Fixed',
  CONFIGURABLE = 'Configurable'
} 

const contractTermSchema = z.object({
  type: z.nativeEnum(ContractType),
  currencyCode: z.string(),
  price: z.string(),
  duration: z.string(),
  paymentSchedule: z.nativeEnum(PaymentSchedule),
})

const usageTermSchema = z.object({
  type: z.nativeEnum(UsageTermType),
  currencyCode: z.string(),
  rateCards: z.array(rateCardsSchema),
})

const pricingSchema = z.object({
  type: z.nativeEnum(PricingType),
  contractTerms: z.optional(contractTermSchema),
  usageTerms: z.optional(usageTermSchema),
})
const legalTermsSchema = z.object({
  type: z.nativeEnum(EulaType),
  eulaUrl: z.string(),
})

const supportTermsSchema = z.object({
  type: z.nativeEnum(SupportTermType),
  refundPolicy: z.string().optional(),
})

// Form schema
const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  productId: z.string({ required_error: 'Please select a product' }),
  buyerAccounts: z.array(z.string(), { required_error: 'Please select at least one buyer account' }),
  visibility: z.nativeEnum(Visibility),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  pricing: z.optional(pricingSchema),
  discount: z.coerce.number().min(0).max(100).optional(),
  validFrom: z.date(),
  validUntil: z.date(),
  publishToAws: z.boolean(),
  billingPeriod: z.nativeEnum(BillingPeriod),
  pricingType: z.nativeEnum(PricingType),
  contractType: z.enum(['Fixed', 'Configurable']),
  legalTerms: z.optional(legalTermsSchema),
  supportTerms: z.optional(supportTermsSchema),
  resaleAuthorizationId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateOffer() {
  const router = useRouter();

  let nextTokenStack: string[] = []

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      visibility: Visibility.PRIVATE,
      price: 0,
      discount: 0,
      publishToAws: false,
      pricingType: PricingType.CONTRACT,
      billingPeriod: BillingPeriod.MONTHLY,
      contractType: 'Fixed',
      buyerAccounts: [],
      validFrom: new Date(),
      validUntil: new Date(new Date().setDate(new Date().getDate() + 30)),
      pricing: {
        type: PricingType.CONTRACT,
        contractTerms: {
          type: ContractType.FIXED,
          currencyCode: 'USD',
          price: '0',
          duration: 'P30D',
          paymentSchedule: PaymentSchedule.MONTHLY,
        },
        usageTerms: {
          type: UsageTermType.UsagePricingTerm,
          currencyCode: 'USD',
          rateCards: [],
        },
      },
      legalTerms: {
        type: EulaType.STANDARD,
        eulaUrl: '',
      },
      supportTerms: {
        type: SupportTermType.StandardSupport,
        refundPolicy: '',
      },
    },
  });

  // Fetch products/listings
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await listingsApi.getListings({
        productTypes: ['SaaSProduct', 'AmiProduct', 'ContainerProduct', 'DataProduct'],
        nextToken: nextTokenStack[0],
        maxResults: 50,
      });
      nextTokenStack.push(response.nextToken!);
      return response.items;
    },
  });

  // Fetch users (for recipient selection)
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await getUsers({
        page: 1,
        limit: 10,
        role: UserRole.BUYER,
      });
      return response.data;
    },
  });

  // Create offer mutation
  const createMutation = useMutation({
    mutationFn: offersApi.createOffer,
    onSuccess: () => {
      toast.success('Offer created successfully');
      router.push('/dashboard/offers');
    },
    onError: (error: any) => {
      toast.error(`Failed to create offer: ${error.message}`);
    },
  });

  // Form submission handler
  const onSubmit = (values: FormValues) => {
    // Calculate duration in days between validFrom and validUntil
    const validFromDate = new Date(values.validFrom);
    const validUntilDate = new Date(values.validUntil);
    const durationInDays = Math.ceil((validUntilDate.getTime() - validFromDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Transform form values to match backend DTO structure
    const offerData = {
      title: values.title,
      description: values.description,
      productId: values.productId,
      visibility: values.visibility,
      price: values.price,
      discount: values.discount,
      validFrom: values.validFrom.toISOString(),
      validUntil: values.validUntil.toISOString(),
      buyerAccounts: values.buyerAccounts,
      billingPeriod: values.billingPeriod,
    };
    
    // Add legal and support terms
    const legalTerms = {
      type: values.legalTerms?.type || EulaType.STANDARD,
      eulaUrl: values.legalTerms?.eulaUrl,
    };
    
    // Add custom EULA URL if provided
    if (values.legalTerms?.type === EulaType.CUSTOM && values.legalTerms?.eulaUrl) {
      legalTerms.eulaUrl = values.legalTerms.eulaUrl;
    }
    
    const supportTerms = {
      type: values.supportTerms?.type || SupportTermType.StandardSupport,
      refundPolicy: values.supportTerms?.refundPolicy,
    };
    
    // Add legal and support terms to the offer data
    Object.assign(offerData, {
      legalTerms,
      supportTerms
    });
    
    // Only add AWS Marketplace fields if publishToAws is true
    if (values.publishToAws) {
      // Add pricing object based on selected pricing type
      const pricing: any = {
        type: values.pricingType
      };
      
      // Add contract terms if pricing type is Contract
      if (values.pricingType === PricingType.CONTRACT) {
        pricing.contractTerms = {
          type: values.contractType,
          currencyCode: 'USD',
          price: values.price.toString(),
          // Convert duration to ISO 8601 duration format
          duration: `P${durationInDays}D`,
          paymentSchedule: values.billingPeriod === BillingPeriod.MONTHLY ? 'Monthly' : 
                           values.billingPeriod === BillingPeriod.QUARTERLY ? 'Quarterly' : 'Annually'
        };
      } else if (values.pricingType === PricingType.USAGE) {
        // Add usage terms if pricing type is Usage
        pricing.usageTerms = {
          type: values.pricing?.usageTerms?.type || UsageTermType.UsagePricingTerm,
          currencyCode: values.pricing?.usageTerms?.currencyCode || 'USD',
          rateCards: values.pricing?.usageTerms?.rateCards || []
        };
      }
      
      // Add AWS fields to the offer data
      Object.assign(offerData, { pricing });
      
      // Add resale authorization ID if provided
      if (values.resaleAuthorizationId) {
        Object.assign(offerData, { resaleAuthorizationId: values.resaleAuthorizationId });
      }
    }
    
    // Log the final data being sent
    console.log('Submitting offer data:', offerData);
    
    createMutation.mutate(offerData);
  };

  // Loading state
  if (isLoadingProducts || isLoadingUsers) {
    return <CreateOfferSkeleton />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Offer</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {/* Main content */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Provide the basic details for your offer
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
                          <Input placeholder="Enter offer title" {...field} />
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
                        <FormDescription>
                          The product or service you're making an offer for
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

               {/* Legal Terms Card */}
               <Card>
                <CardHeader>
                  <CardTitle>Legal Terms</CardTitle>
                  <CardDescription>
                    Specify the legal terms for this offer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SelectButtons
                      control={form.control}
                      name="legalTerms.type"
                      label="Legal Terms"
                      options={EulaType}
                      description="Choose the type of End User License Agreement"
                      gridCols={{ default: 1, sm: 2, md: 3, lg: 4 }}
                    />
                  
                  
                  {form.watch("legalTerms.type") === EulaType.CUSTOM && (
                    <FormField
                      control={form.control}
                      name="legalTerms.eulaUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom EULA URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/eula.pdf" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL to your custom EULA document
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Support Terms Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Support Terms</CardTitle>
                  <CardDescription>
                    Specify the support terms for this offer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <SelectButtons
                    control={form.control}
                    name="supportTerms.type"
                    label="Support Type"
                    options={SupportTermType}
                    description="Choose the type of support provided with this offer"
                    gridCols={{ default: 1, sm: 2, md: 3, lg: 4 }}
                 />
                  
                  
                  {form.watch("supportTerms.type") === SupportTermType.CustomSupport && (
                    <FormField
                      control={form.control}
                      name="supportTerms.refundPolicy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Refund Policy</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your refund policy"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Specify your refund policy for this offer
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Offer Details</CardTitle>
                  <CardDescription>
                    Set the terms of your offer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={"validFrom"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid From</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select the date from validity start"
                          />
                        </FormControl>
                        <FormDescription>
                          When this offer is valid and when it expires
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-4" />

                  <FormField
                    control={form.control}
                    name={"validUntil"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid Until</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select validity period"
                          />
                        </FormControl>
                        <FormDescription>
                          When this offer expires
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="buyerAccounts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buyer Accounts</FormLabel>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {field.value?.map((account, index) => (
                              <div key={index} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-md">
                                <span>{account}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 pl-2"
                                  onClick={() => {
                                    const newAccounts = [...field.value];
                                    newAccounts.splice(index, 1);
                                    field.onChange(newAccounts);
                                  }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                  </svg>
                                  <span className="sr-only">Remove</span>
                                </Button>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex flex-col gap-2 items-center justify-center">
                            <Select
                              onValueChange={(value) => {
                                if (value && !field.value.includes(value)) {
                                  field.onChange([...field.value, value]);
                                }
                              }}
                            >
                              <FormControl className='w-full flex-1'>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a buyer account" />
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
                            <div className="flex items-center">
                              <span className="text-sm text-muted-foreground">or</span>
                            </div>
                            <div className="flex gap-2 w-full">
                              <Input
                                id="custom-account"
                                placeholder="Enter custom account ID"
                                className="w-full"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const input = e.currentTarget;
                                    const value = input.value.trim();
                                    if (value && !field.value.includes(value)) {
                                      field.onChange([...field.value, value]);
                                      input.value = '';
                                    }
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById('custom-account') as HTMLInputElement;
                                  const value = input.value.trim();
                                  if (value && !field.value.includes(value)) {
                                    field.onChange([...field.value, value]);
                                    input.value = '';
                                  }
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                        <FormDescription>
                          The buyer accounts that will receive this offer. You can select from existing users or enter custom account IDs.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              {/* AWS Marketplace Integration Card */}
              <Card>
                <CardHeader>
                  <CardTitle>AWS Marketplace Integration</CardTitle>
                  <CardDescription>
                    Configure settings for publishing this offer to AWS Marketplace
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="publishToAws"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Publish to AWS Marketplace</FormLabel>
                          <FormDescription>
                            Enable to publish this offer to AWS Marketplace
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                
                  <div className="space-y-4 pl-2">
                    <Tabs defaultValue="pricing" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="pricing">Pricing Options</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="pricing" className="space-y-4 mt-4">
                        <SelectButtons
                          control={form.control}
                          name="pricingType"
                          label="Pricing Type"
                          options={PricingType}
                          description="Choose how you want to charge for your product"
                          gridCols={{ default: 1, sm: 2, md: 3, lg: 4 }}
                        />
                        
                        {form.watch("pricingType") === PricingType.CONTRACT && (
                          <div className="space-y-4 border p-4 rounded-md">
                            <h3 className="text-md font-medium">Contract Terms</h3>
                            
                            <SelectButtons
                                control={form.control}
                                name="pricing.contractTerms.type"
                                label="Contract Type"
                                options={ContractType}
                                description="Choose the type of contract"
                                gridCols={{ default: 1, sm: 2, md: 3, lg: 4 }}
                              />
                            
                            
                            <FormField
                              control={form.control}
                              name="billingPeriod"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Billing Period</FormLabel>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      // Map billing period to payment schedule
                                      const paymentSchedule = value === 'MONTHLY' ? PaymentSchedule.MONTHLY : 
                                                            value === 'QUARTERLY' ? PaymentSchedule.QUARTERLY : PaymentSchedule.ANNUALLY;
                                      form.setValue("pricing.contractTerms.paymentSchedule", paymentSchedule);
                                    }}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select billing period" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value={BillingPeriod.MONTHLY}>Monthly</SelectItem>
                                      <SelectItem value={BillingPeriod.QUARTERLY}>Quarterly</SelectItem>
                                      <SelectItem value={BillingPeriod.ANNUALLY}>Annually</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                        
                        {form.watch("pricingType") === PricingType.USAGE && (
                          <div className="space-y-4 border p-4 rounded-md">
                            <h3 className="text-md font-medium">Usage Terms</h3>
                            
                            <SelectButtons
                              control={form.control}
                              name="pricing.usageTerms.type"
                              label="Usage Term Type"
                              options={UsageTermType}
                              description="Select the type of usage term"
                              gridCols={{ default: 1, sm: 2, md: 3, lg: 4 }}
                            />
                            
                            
                            {/* We could add rate card configuration here if needed */}
                            <FormField
                              control={form.control}
                              name="pricing.usageTerms.currencyCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Currency</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className='w-full md:w-1/2'>
                                        <SelectValue placeholder="Select currency" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="USD">USD ($)</SelectItem>
                                      <SelectItem value="EUR">EUR (€)</SelectItem>
                                      <SelectItem value="GBP">GBP (£)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="advanced" className="space-y-4 mt-4">
                        <FormField
                          control={form.control}
                          name="resaleAuthorizationId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Resale Authorization ID</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter resale authorization ID" {...field} />
                              </FormControl>
                              <FormDescription>
                                Optional: Enter a resale authorization ID if applicable
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Offer'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Skeleton loader for create offer page
function CreateOfferSkeleton() {
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
