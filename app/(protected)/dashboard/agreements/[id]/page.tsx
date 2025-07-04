"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { agreementsApi } from "@/services/agreements.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AgreementHeader from "./components/agreement-header";
import AgreementTabs from "./components/agreement-tabs";

function AgreementDetail() {
  const params = useParams();
  const agreementId = params.id as string;

  const { data: agreement, isLoading, error } = useQuery({
    queryKey: ["agreement", agreementId],
    queryFn: () => agreementsApi.getAgreement(agreementId),
    enabled: !!agreementId,
  });


  console.log("agreement: ", agreement);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/agreements">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Skeleton className="h-8 w-[250px]" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !agreement) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load agreement details. Please try again."}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link href="/dashboard/agreements">Back to Agreements</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <AgreementHeader agreement={agreement} />
      <AgreementTabs agreement={agreement} />
    </div>
  );
}

export default AgreementDetail;
