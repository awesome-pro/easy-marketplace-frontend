// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { toast } from "sonner"
// import * as z from "zod"
// import { isvApi } from "@/api/isv.api"
// import { Product, ProductStatus, ProductVisibility, PricingModel } from "@/types"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Separator } from "@/components/ui/separator"
// import { Switch } from "@/components/ui/switch"

// // Form schema
// const productFormSchema = z.object({
//   name: z.string().min(3, "Product name must be at least 3 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   shortDescription: z.string().max(150, "Short description must be less than 150 characters"),
//   visibility: z.nativeEnum(ProductVisibility),
//   pricingModel: z.nativeEnum(PricingModel),
//   price: z.object({
//     amount: z.coerce.number().min(0, "Price must be a positive number"),
//     currency: z.string().default("USD"),
//     billingPeriod: z.string().optional(),
//   }),
//   trialPeriodDays: z.coerce.number().min(0).optional(),
//   categories: z.array(z.string()).optional(),
//   features: z.array(z.object({
//     name: z.string(),
//     description: z.string().optional(),
//   })).optional(),
// });

// type ProductFormValues = z.infer<typeof productFormSchema>;

// interface ProductFormProps {
//   initialData?: Product;
//   isEditing?: boolean;
// }

// export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState("basic");
  
//   // Convert initialData to form values
//   const defaultValues: Partial<ProductFormValues> = initialData ? {
//     name: initialData.name,
//     description: initialData.description || "",
//     visibility: initialData.visibility || ProductVisibility.PRIVATE,
//     price: {
//       amount: initialData.price?.amount || 0,
//       currency: initialData.price?.currency || "USD",
//       billingPeriod: initialData.price?.billingPeriod,
//     },
//     categories: initialData.categories || [],
//     features: initialData.features || [],
//   } : {
//     name: "",
//     description: "",
//     visibility: ProductVisibility.PRIVATE,
//     price: {
//       amount: 0,
//       currency: "USD",
//     },
//     categories: [],
//     features: [],
//   };

//   // Form setup
//   const form = useForm<ProductFormValues>({
//     resolver: zodResolver(productFormSchema),
//     defaultValues,
//   });

//   // Create product mutation
//   const createProductMutation = useMutation({
//     mutationFn: (data: ProductFormValues) => isvApi.createProduct(data),
//     onSuccess: () => {
//       toast.success("Product created successfully");
//       queryClient.invalidateQueries({ queryKey: ['products'] });
//       router.push("/dashboard/isv/products");
//     },
//     onError: (error: any) => {
//       toast.error(`Error creating product: ${error.message}`);
//     }
//   });

//   // Update product mutation
//   const updateProductMutation = useMutation({
//     mutationFn: (data: { id: string; product: ProductFormValues }) => 
//       isvApi.updateProduct(data.id, data.product),
//     onSuccess: () => {
//       toast.success("Product updated successfully");
//       queryClient.invalidateQueries({ queryKey: ['products'] });
//       router.push("/dashboard/isv/products");
//     },
//     onError: (error: any) => {
//       toast.error(`Error updating product: ${error.message}`);
//     }
//   });

//   // Form submission
//   const onSubmit = (data: ProductFormValues) => {
//     if (isEditing && initialData) {
//       updateProductMutation.mutate({ id: initialData.id, product: data });
//     } else {
//       createProductMutation.mutate(data);
//     }
//   };

//   // Handle save as draft (for new products)
//   const handleSaveAsDraft = async () => {
//     const isValid = await form.trigger();
//     if (isValid) {
//       const data = form.getValues();
//       createProductMutation.mutate(data);
//     }
//   };

//   // Handle publish (submit for review)
//   const handlePublish = async () => {
//     const isValid = await form.trigger();
//     if (isValid && initialData) {
//       const data = form.getValues();
//       updateProductMutation.mutate({ 
//         id: initialData.id, 
//         product: { ...data, status: ProductStatus.PENDING_REVIEW } 
//       });
//     }
//   };

//   // Check if form is being submitted
//   const isSubmitting = createProductMutation.isPending || updateProductMutation.isPending;

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>{isEditing ? "Edit Product" : "Create New Product"}</CardTitle>
//             <CardDescription>
//               {isEditing 
//                 ? "Update your product information" 
//                 : "Add a new product to your marketplace listings"}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Tabs value={activeTab} onValueChange={setActiveTab}>
//               <TabsList className="grid w-full grid-cols-4">
//                 <TabsTrigger value="basic">Basic Info</TabsTrigger>
//                 <TabsTrigger value="pricing">Pricing</TabsTrigger>
//                 <TabsTrigger value="features">Features</TabsTrigger>
//                 <TabsTrigger value="support">Support</TabsTrigger>
//               </TabsList>
              
//               {/* Basic Info Tab */}
//               <TabsContent value="basic" className="space-y-4 pt-4">
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Product Name *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter product name" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 <FormField
//                   control={form.control}
//                   name="shortDescription"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Short Description</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Brief description (150 chars max)" {...field} />
//                       </FormControl>
//                       <FormDescription>
//                         A short tagline that appears in product listings
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Full Description *</FormLabel>
//                       <FormControl>
//                         <Textarea 
//                           placeholder="Detailed product description" 
//                           className="min-h-[150px]" 
//                           {...field} 
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 <FormField
//                   control={form.control}
//                   name="visibility"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Visibility</FormLabel>
//                       <Select 
//                         onValueChange={field.onChange} 
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select visibility" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value={ProductVisibility.PUBLIC}>Public</SelectItem>
//                           <SelectItem value={ProductVisibility.PRIVATE}>Private</SelectItem>
//                           <SelectItem value={ProductVisibility.UNLISTED}>Unlisted</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormDescription>
//                         Controls who can see your product in the marketplace
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </TabsContent>
              
//               {/* Pricing Tab */}
//               <TabsContent value="pricing" className="space-y-4 pt-4">
//                 <FormField
//                   control={form.control}
//                   name="pricingModel"
//                   render={({ field }) => (
//                     <FormItem className="space-y-3">
//                       <FormLabel>Pricing Model</FormLabel>
//                       <FormControl>
//                         <RadioGroup
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                           className="flex flex-col space-y-1"
//                         >
//                           <FormItem className="flex items-center space-x-3 space-y-0">
//                             <FormControl>
//                               <RadioGroupItem value={PricingModel.FREE} />
//                             </FormControl>
//                             <FormLabel className="font-normal">
//                               Free
//                             </FormLabel>
//                           </FormItem>
//                           <FormItem className="flex items-center space-x-3 space-y-0">
//                             <FormControl>
//                               <RadioGroupItem value={PricingModel.ONE_TIME} />
//                             </FormControl>
//                             <FormLabel className="font-normal">
//                               One-time payment
//                             </FormLabel>
//                           </FormItem>
//                           <FormItem className="flex items-center space-x-3 space-y-0">
//                             <FormControl>
//                               <RadioGroupItem value={PricingModel.SUBSCRIPTION} />
//                             </FormControl>
//                             <FormLabel className="font-normal">
//                               Subscription
//                             </FormLabel>
//                           </FormItem>
//                           <FormItem className="flex items-center space-x-3 space-y-0">
//                             <FormControl>
//                               <RadioGroupItem value={PricingModel.USAGE_BASED} />
//                             </FormControl>
//                             <FormLabel className="font-normal">
//                               Usage-based
//                             </FormLabel>
//                           </FormItem>
//                         </RadioGroup>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="price.amount"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Price Amount</FormLabel>
//                         <FormControl>
//                           <Input type="number" min="0" step="0.01" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
                  
//                   <FormField
//                     control={form.control}
//                     name="price.currency"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Currency</FormLabel>
//                         <Select 
//                           onValueChange={field.onChange} 
//                           defaultValue={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select currency" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="USD">USD ($)</SelectItem>
//                             <SelectItem value="EUR">EUR (€)</SelectItem>
//                             <SelectItem value="GBP">GBP (£)</SelectItem>
//                             <SelectItem value="INR">INR (₹)</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
                
//                 {form.watch("pricingModel") === PricingModel.SUBSCRIPTION && (
//                   <FormField
//                     control={form.control}
//                     name="price.billingPeriod"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Billing Period</FormLabel>
//                         <Select 
//                           onValueChange={field.onChange} 
//                           defaultValue={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select billing period" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="MONTHLY">Monthly</SelectItem>
//                             <SelectItem value="QUARTERLY">Quarterly</SelectItem>
//                             <SelectItem value="YEARLY">Yearly</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 )}
                
//                 {(form.watch("pricingModel") === PricingModel.SUBSCRIPTION) && (
//                   <FormField
//                     control={form.control}
//                     name="trialPeriodDays"
//                     render={({ field }) => (
//                       <FormItem>
//                         <div className="flex items-center justify-between">
//                           <FormLabel>Free Trial Period (Days)</FormLabel>
//                           <Switch 
//                             checked={field.value > 0}
//                             onCheckedChange={(checked) => {
//                               field.onChange(checked ? 30 : 0);
//                             }}
//                           />
//                         </div>
//                         {field.value > 0 && (
//                           <FormControl>
//                             <Input type="number" min="1" max="365" {...field} />
//                           </FormControl>
//                         )}
//                         <FormDescription>
//                           Offer a free trial period for your subscription
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 )}
//               </TabsContent>
              
//               {/* Features Tab */}
//               <TabsContent value="features" className="space-y-4 pt-4">
//                 <FormField
//                   control={form.control}
//                   name="features"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Product Features</FormLabel>
//                       <FormDescription>
//                         Add key features of your product
//                       </FormDescription>
//                       <div className="space-y-2">
//                         {field.value?.map((feature, index) => (
//                           <div key={index} className="flex items-center gap-2">
//                             <Input
//                               placeholder="Feature name"
//                               value={feature.name}
//                               onChange={(e) => {
//                                 const newFeatures = [...field.value!];
//                                 newFeatures[index].name = e.target.value;
//                                 field.onChange(newFeatures);
//                               }}
//                               className="flex-1"
//                             />
//                             <Button
//                               type="button"
//                               variant="outline"
//                               size="sm"
//                               onClick={() => {
//                                 const newFeatures = [...field.value!];
//                                 newFeatures.splice(index, 1);
//                                 field.onChange(newFeatures);
//                               }}
//                             >
//                               Remove
//                             </Button>
//                           </div>
//                         ))}
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => {
//                             const currentFeatures = field.value || [];
//                             field.onChange([...currentFeatures, { name: "" }]);
//                           }}
//                         >
//                           Add Feature
//                         </Button>
//                       </div>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 <FormField
//                   control={form.control}
//                   name="requirements"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>System Requirements</FormLabel>
//                       <FormControl>
//                         <Textarea 
//                           placeholder="System requirements or prerequisites" 
//                           className="min-h-[100px]" 
//                           {...field} 
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         Specify any system requirements or prerequisites for using your product
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </TabsContent>
              
//               {/* Support Tab */}
//               <TabsContent value="support" className="space-y-4 pt-4">
//                 <FormField
//                   control={form.control}
//                   name="supportEmail"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Support Email</FormLabel>
//                       <FormControl>
//                         <Input type="email" placeholder="support@example.com" {...field} />
//                       </FormControl>
//                       <FormDescription>
//                         Email address for customer support inquiries
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 <FormField
//                   control={form.control}
//                   name="supportUrl"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Support Website</FormLabel>
//                       <FormControl>
//                         <Input placeholder="https://support.example.com" {...field} />
//                       </FormControl>
//                       <FormDescription>
//                         URL to your support portal or documentation
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 <Separator className="my-4" />
                
//                 <FormField
//                   control={form.control}
//                   name="termsUrl"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Terms of Service URL</FormLabel>
//                       <FormControl>
//                         <Input placeholder="https://example.com/terms" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 <FormField
//                   control={form.control}
//                   name="privacyUrl"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Privacy Policy URL</FormLabel>
//                       <FormControl>
//                         <Input placeholder="https://example.com/privacy" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//           <CardFooter className="flex justify-between">
//             <Button 
//               type="button" 
//               variant="outline" 
//               onClick={() => router.push("/dashboard/isv/products")}
//             >
//               Cancel
//             </Button>
//             <div className="flex gap-2">
//               {!isEditing && (
//                 <Button 
//                   type="button" 
//                   variant="outline" 
//                   onClick={handleSaveAsDraft}
//                   disabled={isSubmitting}
//                 >
//                   Save as Draft
//                 </Button>
//               )}
//               {isEditing && initialData?.status === ProductStatus.DRAFT && (
//                 <Button 
//                   type="button" 
//                   variant="secondary" 
//                   onClick={handlePublish}
//                   disabled={isSubmitting}
//                 >
//                   Submit for Review
//                 </Button>
//               )}
//               <Button type="submit" disabled={isSubmitting}>
//                 {isEditing ? "Update Product" : "Create Product"}
//               </Button>
//             </div>
//           </CardFooter>
//         </Card>
//       </form>
//     </Form>
//   )
// }
