"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductSummary } from "@/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { IconUsers } from "@tabler/icons-react"

interface TopProductsProps {
  products: ProductSummary[]
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Your best performing products by revenue</CardDescription>
      </CardHeader>
      <CardContent>
        {
          products.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="space-y-8">
              {products.map((product) => (
                <div key={product.id} className="flex items-center">
                  <Avatar className="h-9 w-9 mr-4">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {product.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  ${product.revenue.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <IconUsers className="h-4 w-4" />
                <span>{product.customers}</span>
              </div>
            </div>
          ))}
        </div>
        )
        }
      </CardContent>
    </Card>
  )
}
