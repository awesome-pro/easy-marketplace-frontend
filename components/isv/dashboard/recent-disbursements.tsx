"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DisbursementSummary, DisbursementStatus } from "@/types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface RecentDisbursementsProps {
  disbursements: DisbursementSummary[]
}

export function RecentDisbursements({ disbursements }: RecentDisbursementsProps) {
  const getStatusColor = (status: DisbursementStatus) => {
    switch (status) {
      case DisbursementStatus.COMPLETED:
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case DisbursementStatus.PENDING:
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case DisbursementStatus.PROCESSING:
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case DisbursementStatus.FAILED:
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Disbursements</CardTitle>
        <CardDescription>Your latest payment disbursements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {disbursements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent disbursements found.</p>
          ) : (
            disbursements.map((disbursement) => (
              <div key={disbursement.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{disbursement.period}</p>
                  <p className="text-sm text-muted-foreground">
                    {disbursement.disbursedAt
                      ? format(new Date(disbursement.disbursedAt), "MMM d, yyyy")
                      : "Pending"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium">
                    {disbursement.currency} {disbursement.amount.toLocaleString()}
                  </p>
                  <Badge className={getStatusColor(disbursement.status)} variant="outline">
                    {disbursement.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
