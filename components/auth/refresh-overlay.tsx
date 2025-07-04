'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface RefreshOverlayProps {
  isVisible: boolean;
  message?: string;
  timeout?: number;
}

const RefreshOverlay: React.FC<RefreshOverlayProps> = ({ 
  isVisible, 
  message = 'Refreshing your session...', 
  timeout = 15000 
}) => {
  const [showTimeout, setShowTimeout] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isVisible) {
      timer = setTimeout(() => {
        setShowTimeout(true);
      }, timeout);
    } else {
      setShowTimeout(false);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, timeout]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">{message}</h3>
        <p className="text-muted-foreground text-sm">
          {showTimeout 
            ? 'This is taking longer than expected. Please wait a moment...' 
            : 'Please wait while we secure your session.'}
        </p>
      </div>
    </div>
  );
};

export default RefreshOverlay;
