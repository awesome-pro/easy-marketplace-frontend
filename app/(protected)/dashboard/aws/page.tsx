"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import * as awsApi from '@/services/aws.api';
import { AwsProductType, AwsVisibility } from '@/types/aws';


function AWSPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs = ['ISV', 'Buyer', 'Reseller', 'Distributor'];

  const handleApiCall = async (apiFunction: () => Promise<any>, label: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction();
      setApiResponse(response);
      console.log(`${label} response:`, response);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error(`${label} error:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">AWS Marketplace Integration Test</h1>
      
      <Tabs defaultValue={tabs[activeTab]} onValueChange={(value) => setActiveTab(tabs.indexOf(value))}>
        <TabsList className="grid grid-cols-4 gap-2">
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-2">
          <TabsContent value={tabs[0]} className="rounded-xl bg-white p-3 ring-1 ring-gray-200">
            <IsvPanel onApiCall={handleApiCall} />
          </TabsContent>
          <TabsContent value={tabs[1]} className="rounded-xl bg-white p-3 ring-1 ring-gray-200">
            <BuyerPanel onApiCall={handleApiCall} />
          </TabsContent>
          <TabsContent value={tabs[2]} className="rounded-xl bg-white p-3 ring-1 ring-gray-200">
            <ResellerPanel onApiCall={handleApiCall} />
          </TabsContent>
          <TabsContent value={tabs[3]} className="rounded-xl bg-white p-3 ring-1 ring-gray-200">
            <DistributorPanel onApiCall={handleApiCall} />
          </TabsContent>
        </div>
      </Tabs>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">API Response</h2>
        {loading && <div className="text-blue-500">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && apiResponse && (
          <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap">{JSON.stringify(apiResponse, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

interface PanelProps {
  onApiCall: (apiFunction: () => Promise<any>, label: string) => void;
}

function IsvPanel({ onApiCall }: PanelProps) {
  const { register, handleSubmit } = useForm();
  const [awsId, setAwsId] = useState('');
  const [productId, setProductId] = useState('');
  const [productType, setProductType] = useState<AwsProductType>(AwsProductType.SAAS);

  const onGetProducts = () => {
    onApiCall(() => awsApi.getIsvProducts(awsId), 'Get ISV Products');
  };

  const onGetProductDetails = () => {
    onApiCall(() => awsApi.getIsvProductDetails(productId, productType), 'Get Product Details');
  };

  const onCreateSaasProduct = (data: any) => {
    const payload = {
      title: data.title,
      description: data.description,
      awsId: data.awsId,
      productData: JSON.parse(data.productData || '{}')
    };
    onApiCall(() => awsApi.createSaasProduct(payload), 'Create SaaS Product');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">ISV Operations</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Get Products</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={awsId}
              onChange={(e) => setAwsId(e.target.value)}
              placeholder="AWS ID"
              className="border rounded px-2 py-1 flex-grow"
            />
            <button
              onClick={onGetProducts}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Get Products
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Get Product Details</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Product ID"
              className="border rounded px-2 py-1 flex-grow"
            />
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value as AwsProductType)}
              className="border rounded px-2 py-1"
            >
              {Object.values(AwsProductType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button
              onClick={onGetProductDetails}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Get Details
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Create SaaS Product</h3>
          <form onSubmit={handleSubmit(onCreateSaasProduct)} className="space-y-2">
            <div>
              <input
                {...register('title', { required: true })}
                placeholder="Title"
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <input
                {...register('description', { required: true })}
                placeholder="Description"
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <input
                {...register('awsId', { required: true })}
                placeholder="AWS ID"
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <textarea
                {...register('productData')}
                placeholder="Product Data (JSON)"
                className="border rounded px-2 py-1 w-full h-20"
                defaultValue="{}"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Create Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function BuyerPanel({ onApiCall }: PanelProps) {
  const { register, handleSubmit } = useForm();
  const [productId, setProductId] = useState('');
  const [productType, setProductType] = useState<AwsProductType>(AwsProductType.SAAS);
  const [productCode, setProductCode] = useState('');

  const onDiscoverProducts = (data: any) => {
    const filters = data.filters ? JSON.parse(data.filters) : undefined;
    onApiCall(() => awsApi.discoverProducts(filters), 'Discover Products');
  };

  const onGetProductDetails = () => {
    onApiCall(() => awsApi.getBuyerProductDetails(productId, productType), 'Get Product Details');
  };

  const onCheckEntitlements = (data: any) => {
    const customerIdentifier = JSON.parse(data.customerIdentifier || '{}');
    onApiCall(
      () => awsApi.checkEntitlements(productCode, customerIdentifier),
      'Check Entitlements'
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Buyer Operations</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Discover Products</h3>
          <form onSubmit={handleSubmit(onDiscoverProducts)} className="space-y-2">
            <div>
              <textarea
                {...register('filters')}
                placeholder="Filters (JSON)"
                className="border rounded px-2 py-1 w-full h-20"
                defaultValue="{}"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Discover Products
            </button>
          </form>
        </div>

        <div>
          <h3 className="font-medium mb-2">Get Product Details</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Product ID"
              className="border rounded px-2 py-1 flex-grow"
            />
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value as AwsProductType)}
              className="border rounded px-2 py-1"
            >
              {Object.values(AwsProductType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button
              onClick={onGetProductDetails}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Get Details
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Check Entitlements</h3>
          <form onSubmit={handleSubmit(onCheckEntitlements)} className="space-y-2">
            <div>
              <input
                type="text"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                placeholder="Product Code"
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <textarea
                {...register('customerIdentifier')}
                placeholder="Customer Identifier (JSON)"
                className="border rounded px-2 py-1 w-full h-20"
                defaultValue='{"CustomerIdentifierType": ["value1", "value2"]}'
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Check Entitlements
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ResellerPanel({ onApiCall }: PanelProps) {
  const { register, handleSubmit } = useForm();
  const [customerAwsId, setCustomerAwsId] = useState('');
  
  const onCreatePrivateOffer = (data: any) => {
    const payload = {
      productId: data.productId,
      buyerAwsId: data.buyerAwsId,
      offerData: JSON.parse(data.offerData || '{}')
    };
    onApiCall(() => awsApi.createCustomerPrivateOffer(payload), 'Create Private Offer');
  };

  const onViewSubscriptionStatus = () => {
    const productCodes = ['prod1', 'prod2']; // Example product codes
    onApiCall(
      () => awsApi.viewCustomerSubscriptionStatus(customerAwsId, productCodes),
      'View Subscription Status'
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Reseller Operations</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Create Private Offer</h3>
          <form onSubmit={handleSubmit(onCreatePrivateOffer)} className="space-y-2">
            <div>
              <input
                {...register('productId', { required: true })}
                placeholder="Product ID"
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <input
                {...register('buyerAwsId', { required: true })}
                placeholder="Buyer AWS ID"
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <textarea
                {...register('offerData')}
                placeholder="Offer Data (JSON)"
                className="border rounded px-2 py-1 w-full h-20"
                defaultValue="{}"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Create Offer
            </button>
          </form>
        </div>

        <div>
          <h3 className="font-medium mb-2">View Customer Subscription Status</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={customerAwsId}
              onChange={(e) => setCustomerAwsId(e.target.value)}
              placeholder="Customer AWS ID"
              className="border rounded px-2 py-1 flex-grow"
            />
            <button
              onClick={onViewSubscriptionStatus}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              View Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DistributorPanel({ onApiCall }: PanelProps) {
  const { register, handleSubmit } = useForm();
  const [distributorAwsId, setDistributorAwsId] = useState('');
  
  const onListPortfolioProducts = () => {
    onApiCall(
      () => awsApi.listPortfolioProducts(distributorAwsId),
      'List Portfolio Products'
    );
  };

  const onAddProductToPortfolio = (data: any) => {
    const payload = {
      distributorAwsId: data.distributorAwsId,
      productId: data.productId,
      productType: data.productType as AwsProductType
    };
    onApiCall(() => awsApi.addProductToPortfolio(payload), 'Add Product to Portfolio');
  };

  const onCreateResellerOffer = (data: any) => {
    const payload = {
      distributorAwsId: data.distributorAwsId,
      productId: data.productId,
      resellerAwsId: data.resellerAwsId,
      offerData: JSON.parse(data.offerData || '{}')
    };
    onApiCall(() => awsApi.createResellerPrivateOffer(payload), 'Create Reseller Offer');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Distributor Operations</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">List Portfolio Products</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={distributorAwsId}
              onChange={(e) => setDistributorAwsId(e.target.value)}
              placeholder="Distributor AWS ID"
              className="border rounded px-2 py-1 flex-grow"
            />
            <button
              onClick={onListPortfolioProducts}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              List Products
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Add Product to Portfolio</h3>
          <form onSubmit={handleSubmit(onAddProductToPortfolio)} className="space-y-2">
            <div>
              <input
                {...register('distributorAwsId', { required: true })}
                placeholder="Distributor AWS ID"
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <input
                {...register('productId', { required: true })}
                placeholder="Product ID"
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <select
                {...register('productType', { required: true })}
                className="border rounded px-2 py-1 w-full"
              >
                {Object.values(AwsProductType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {/* <button
              type="submit"
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Add Product
            </button> */}
          </form>
        </div>

        <div>
          <h3 className="font-medium mb-2">Create Reseller Offer</h3>
          <form onSubmit={handleSubmit(onCreateResellerOffer)} className="space-y-2">
            <div>
              <input
                {...register('distributorAwsId', { required: true })}
                placeholder="Distributor AWS ID"
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <input
                {...register('productId', { required: true })}
                placeholder="Product ID"
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <input
                {...register('resellerAwsId', { required: true })}
                placeholder="Reseller AWS ID"
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <textarea
                {...register('offerData')}
                placeholder="Offer Data (JSON)"
                className="border rounded px-2 py-1 w-full h-20"
                defaultValue="{}"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Create Offer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AWSPage;
