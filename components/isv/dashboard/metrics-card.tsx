"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface MetricsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change?: number
  description?: string
  className?: string
}

export function MetricsCard({
  title,
  value,
  icon,
  change,
  description,
  className,
}: MetricsCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p
            className={cn(
              "flex items-center text-xs",
              isPositive && "text-emerald-500",
              isNegative && "text-rose-500"
            )}
          >
            {isPositive && <IconArrowUpRight className="mr-1 h-3 w-3" />}
            {isNegative && <IconArrowDownRight className="mr-1 h-3 w-3" />}
            {Math.abs(change)}%
            {description && <span className="text-muted-foreground ml-1">{description}</span>}
          </p>
        )}
        {!change && description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
