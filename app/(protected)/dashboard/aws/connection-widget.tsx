'use client';

import React, { useState, useEffect } from 'react';
import { getAwsConnectionStatus } from '@/services/aws.api';
import { ConnectionStatus } from '@/components/aws';
import { AwsConnectionStatus } from '@/types/aws';

export const ConnectionWidget = () => {
  const [status, setStatus] = useState<AwsConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnectionStatus = async () => {
      try {
        setIsLoading(true);
        const data = await getAwsConnectionStatus();
        setStatus(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch AWS connection status');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnectionStatus();
  }, []);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    getAwsConnectionStatus()
      .then(data => {
        setStatus(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch AWS connection status');
        setIsLoading(false);
      });
  };

  const handleDisconnect = () => {
    // Refresh the status after disconnect
    handleRetry();
  };

  return (
    <ConnectionStatus 
      status={status} 
      isLoading={isLoading} 
      onRetry={handleRetry}
      onDisconnect={handleDisconnect}
    />
  );
};

export default ConnectionWidget;
