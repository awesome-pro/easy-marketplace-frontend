import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Unauthorised() {
  return (
    <section className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Unauthorised</CardTitle>
                <CardDescription>You do not have access to this page</CardDescription>
            </CardHeader>
            <CardContent>
                    <Link href="/dashboard">
                        <Button>
                            Go Back to Dashboard
                        </Button>
                    </Link>
            </CardContent>
        </Card>
    </section>
  )
}

export default Unauthorised