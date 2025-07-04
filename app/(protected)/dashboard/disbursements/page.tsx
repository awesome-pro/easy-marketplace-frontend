"use client"

import { Suspense } from "react"
import { DisbursementsListComponent } from "@/components/isv/disbursements-list"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function DisbursementsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Disbursements</h2>
      </div>
      
      <div className="space-y-4">
        <Suspense fallback={<DisbursementsListSkeleton />}>
          <DisbursementsListComponent />
        </Suspense>
      </div>
    </div>
  )
}

function DisbursementsListSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <Skeleton className="h-10 w-[250px]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <div className="h-10 bg-muted px-4 flex items-center">
          <Skeleton className="h-4 w-[200px]" />
        </div>
        
        {Array(5).fill(null).map((_, i) => (
          <div key={i} className="border-t h-16 px-4 flex items-center">
            <Skeleton className="h-4 w-full max-w-[800px]" />
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-4 w-[200px]" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-[80px]" />
          <Skeleton className="h-8 w-[80px]" />
        </div>
      </div>
    </Card>
  )
}