'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, ComposedChart, Tooltip, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface MapChartProps {
  title: string;
  description?: string;
  data: Array<{ country: string; count: number }>;
  className?: string;
}

export function MapChart({
  title,
  description,
  data,
  className,
}: MapChartProps) {
  // Sort data by count in descending order
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  
  // Take top 10 countries for better visualization
  const topCountries = sortedData.slice(0, 10);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              layout="vertical"
              data={topCountries}
              margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis 
                dataKey="country" 
                type="category" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                width={80}
              />
              <Tooltip 
                formatter={(value) => [`${value} users`, 'Count']}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(229, 231, 235, 1)'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#0ea5e9" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
                name="Users"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
