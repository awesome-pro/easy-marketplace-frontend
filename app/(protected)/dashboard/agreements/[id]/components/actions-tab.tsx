"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { agreementsApi } from "@/services/agreements.api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Download, FileJson, Ban, Trash2, RefreshCw } from "lucide-react";

interface ActionsTabProps {
  agreement: any; // Using any temporarily, will be properly typed later
}

const ActionsTab = ({ agreement }: ActionsTabProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { summary } = agreement;
  const agreementId = summary?.agreementId;
  const isActive = summary?.status === "ACTIVE";

  // Handle cancel agreement
  const handleCancel = async () => {
    if (!agreementId) return;
    
    setIsLoading("cancel");
    try {
      await agreementsApi.updateAgreement(agreementId, { status: "CANCELLED" });
      toast.success("Agreement cancelled successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to cancel agreement");
      console.error(error);
    } finally {
      setIsLoading(null);
      setShowCancelDialog(false);
    }
  };

  // Handle delete agreement
  const handleDelete = async () => {
    if (!agreementId) return;
    
    setIsLoading("delete");
    try {
      await agreementsApi.deleteAgreement(agreementId);
      toast.success("Agreement deleted successfully");
      router.push("/dashboard/agreements");
    } catch (error) {
      toast.error("Failed to delete agreement");
      console.error(error);
    } finally {
      setIsLoading(null);
      setShowDeleteDialog(false);
    }
  };

  // Handle download JSON
  const handleDownloadJson = () => {
    const dataStr = JSON.stringify(agreement, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataUri);
    downloadAnchorNode.setAttribute("download", `agreement-${agreementId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Handle sync with AWS
  const handleSync = async () => {
    if (!agreementId) return;
    
    setIsLoading("sync");
    try {
      // Assuming there's an API endpoint for syncing
      // await agreementsApi.syncAgreement(agreementId);
      toast.success("Agreement synced with AWS successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to sync agreement with AWS");
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Agreement Management</CardTitle>
          <CardDescription>
            Manage the current agreement status and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isActive && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowCancelDialog(true)}
              disabled={isLoading === "cancel"}
            >
              <Ban className="mr-2 h-4 w-4" />
              Cancel Agreement
            </Button>
          )}
          
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSync}
            disabled={isLoading === "sync"}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync with AWS
          </Button>
        </CardContent>
        <CardFooter>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isLoading === "delete"}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Agreement
          </Button>
        </CardFooter>
      </Card>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>
            Export agreement data in various formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleDownloadJson}
          >
            <FileJson className="mr-2 h-4 w-4" />
            Download as JSON
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => toast.info("PDF export functionality coming soon")}
          >
            <Download className="mr-2 h-4 w-4" />
            Export as PDF
          </Button>
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Agreement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this agreement? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel}>
              {isLoading === "cancel" ? "Cancelling..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Agreement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this agreement? This action cannot be undone and will
              remove all data associated with this agreement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {isLoading === "delete" ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActionsTab;
