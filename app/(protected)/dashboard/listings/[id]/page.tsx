'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ProductDetail } from '@/components/products/product-detail/product-detail';
import { useProductDetail } from '@/hooks/use-product-detail';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  
  const { product, isLoading, error } = useProductDetail(productId);

  return (
    <ProductDetail 
      product={product} 
      isLoading={isLoading} 
      error={error} 
    />
  );
}
