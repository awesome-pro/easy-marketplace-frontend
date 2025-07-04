'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarChartProps {
  title: string;
  description?: string;
  data: Array<{ [key: string]: any }>;
  bars: Array<{
    dataKey: string;
    name: string;
    color: string;
  }>;
  xAxisDataKey: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string) => [string, string];
  className?: string;
  layout?: 'vertical' | 'horizontal';
}

export function BarChart({
  title,
  description,
  data,
  bars,
  xAxisDataKey,
  yAxisFormatter = (value) => `${value}`,
  tooltipFormatter,
  className,
  layout = 'horizontal',
}: BarChartProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data}
              layout={layout}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={layout === 'horizontal'} vertical={layout === 'vertical'} />
              <XAxis 
                dataKey={layout === 'horizontal' ? xAxisDataKey : undefined} 
                type={layout === 'horizontal' ? 'category' : 'number'}
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                dataKey={layout === 'vertical' ? xAxisDataKey : undefined}
                type={layout === 'vertical' ? 'category' : 'number'}
                tickFormatter={layout === 'horizontal' ? yAxisFormatter : undefined}
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                formatter={tooltipFormatter}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(229, 231, 235, 1)'
                }}
              />
              <Legend />
              {bars.map((bar, index) => (
                <Bar
                  key={index}
                  dataKey={bar.dataKey}
                  name={bar.name}
                  fill={bar.color}
                  radius={[4, 4, 0, 0]}
                  barSize={layout === 'horizontal' ? 30 : 20}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
