import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, BellRing } from "lucide-react";
import { MdOutlineDevices } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface DeviceRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  deviceInfo: {
    deviceType: string;
    deviceName: string;
  } | null;
}

export function DeviceRegistrationDialog({
  open,
  onOpenChange,
  onConfirm,
  loading,
  deviceInfo,
}: DeviceRegistrationDialogProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // Handle confirmation with loading state
  const handleConfirm = async () => {
    if (loading) return;
    await onConfirm();
  };

  // Handle dialog close
  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[90vw] p-4 sm:p-6 rounded-lg">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary flex-shrink-0" />
            <DialogTitle className="text-base sm:text-lg">Enable Notifications</DialogTitle>
          </div>
          <DialogDescription className="pt-1 text-sm leading-normal">
            Stay informed about important updates, messages, and activities in your real estate workflow.
          </DialogDescription>
        </DialogHeader>

        {deviceInfo && (
          <div className="space-y-3 mt-2">
            <div className="rounded-lg border p-3 bg-muted/50">
              <div className="flex items-center gap-2">
                <MdOutlineDevices className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {deviceInfo.deviceName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Type: {deviceInfo.deviceType}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-muted-foreground">
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Instant property updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Client messages and inquiries</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Important deadlines and reminders</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        <DialogFooter className={cn(
          "mt-4 gap-2",
          isMobile ? "flex-col" : "sm:justify-between"
        )}>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className={cn(
              "transition-opacity w-full sm:w-auto",
              loading && "opacity-50"
            )}
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full sm:w-auto min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enabling...
              </>
            ) : (
              'Enable Notifications'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}