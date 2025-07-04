'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function MetricsCard({
  title,
  value,
  icon,
  description,
  change,
  trend,
  className,
}: MetricsCardProps) {
  // Determine trend if not explicitly provided
  const determinedTrend = trend || (change ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral') : undefined);
  
  // Format change value
  const formattedChange = change !== undefined ? `${change >= 0 ? '+' : ''}${change}%` : undefined;

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            {icon}
          </div>
          {formattedChange && (
            <Badge 
              variant={determinedTrend === 'up' ? 'success' : determinedTrend === 'down' ? 'destructive' : 'default'} 
              className="px-2 py-1"
            >
              {formattedChange}
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="text-3xl font-bold mt-1">{value}</div>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
