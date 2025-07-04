// "use client";

// import React, { useEffect, useCallback, useState } from "react";
// import { toast } from "sonner";
// import {
//   requestNotificationPermission,
//   onMessageListener,
//   registerServiceWorker,
//   unregisterDevice,
// } from "@/lib/firebase";
// import { useAuthContext } from "@/providers/auth-provider";
// import { getDeviceInfo, DeviceType } from "@/utils/device";
// import api from "@/lib/axios";
// // GraphQL Queries and Mutations


// export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuthContext();
//   const [registrationLoading, setRegistrationLoading] = useState(false);
//   const [showDialog, setShowDialog] = useState(false);
//   const deviceInfo = getDeviceInfo();

//   // Track whether setup has run to prevent redundant calls
//   const [hasSetupRun, setHasSetupRun] = useState(false);

//   // Validate device info
//   const validateDeviceInfo = (info: ReturnType<typeof getDeviceInfo>) => {
//     if (!info || !info.deviceId || !info.deviceType) return false;
//     return Object.values(DeviceType).includes(info.deviceType as DeviceType);
//   };

//   // Query to check if device is already registered
//   const { data: deviceData } = await api.get('/device/current');

//   // Handle device registration
//   const handleDeviceRegistration = useCallback(async () => {
//     if (!deviceInfo || !validateDeviceInfo(deviceInfo)) {
//       toast.error("Invalid device information");
//       return;
//     }

//     try {
//       setRegistrationLoading(true);

//       const registration = await registerServiceWorker();
//       if (!registration) {
//         throw new Error("Service worker registration failed");
//       }

//       const { token, error } = await requestNotificationPermission(deviceInfo);
//       if (error || !token) {
//         throw new Error(error || "Failed to get notification permission");
//       }
//       // Refetch device data to update UI
//       await refetchDevice();

//       toast.success("Device registered successfully", {
//         description: "You will now receive notifications on this device.",
//       });

//       // Close dialog and reset states
//       setShowDialog(false);
//       setHasSetupRun(true);
//     } catch (error) {
//       toast.error("Failed to register device", {
//         description: error instanceof Error ? error.message : "Unknown error occurred",
//       });
//     } finally {
//       setRegistrationLoading(false);
//     }
//   }, [deviceInfo, registerDeviceMutation, refetchDevice]);

//   // Cleanup device on logout or unmount
//   const handleDeviceCleanup = useCallback(async () => {
//     if (deviceData?.currentDevice?.deviceId) {
//       try {
//         await unregisterDevice(deviceData.currentDevice.deviceId);
//         await unregisterDeviceMutation({
//           variables: { deviceId: deviceData.currentDevice.deviceId },
//         });
//         console.log("Device unregistered successfully");
//       } catch (error) {
//         console.error("Error cleaning up device:", error);
//       }
//     }
//   }, [deviceData, unregisterDeviceMutation]);

//   // Setup notifications only once when authenticated
//   const setupNotifications = useCallback(async () => {
//     if (!isAuthenticated || isLoading || !deviceInfo || hasSetupRun) return;

//     if (deviceData?.currentDevice) {
//       console.log("Device already registered:", deviceData.currentDevice);
//       await registerServiceWorker();
//       setHasSetupRun(true);
//     } else if (!deviceLoading && deviceError?.message.includes("Device not found")) {
//       // Device not registered, show registration dialog
//       setShowDialog(true);
//       setHasSetupRun(true); // Mark setup as complete even if user dismisses dialog
//     }
//   }, [isAuthenticated, isLoading, deviceInfo, deviceData, deviceLoading, deviceError, hasSetupRun]);

//   // Run setup when auth state changes
//   useEffect(() => {
//     setupNotifications();
//   }, [isAuthenticated, isLoading, deviceInfo, setupNotifications]);

//   // Foreground message listener
//   useEffect(() => {
//     const listener = onMessageListener();
//     listener
//       .then((payload: any) => {
//         if (payload?.notification) {
//           toast(payload.notification.title, {
//             description: payload.notification.body,
//             action: {
//               label: "View",
//               onClick: () => {
//                 const url = payload.data?.url || "/";
//                 window.location.href = url;
//               },
//             },
//           });
//         }
//       })
//       .catch((error) => console.error("Error in message listener:", error));
//   }, []);

//   // Cleanup on unmount or logout
//   useEffect(() => {
//     return () => {
//       if (!isAuthenticated) {
//         handleDeviceCleanup();
//       }
//     };
//   }, [isAuthenticated, handleDeviceCleanup]);

//   const handleDialogChange = (open: boolean) => {
//     setShowDialog(open);
//     if (!open) {
//       // Don't reset hasSetupRun when dialog is dismissed
//       // This prevents the dialog from reappearing immediately
//     }
//   };

//   return (
//     <>
//       <DeviceRegistrationDialog
//         open={showDialog}
//         onOpenChange={handleDialogChange}
//         onConfirm={handleDeviceRegistration}
//         loading={registrationLoading}
//         deviceInfo={deviceInfo}
//       />
//       {children}
//     </>
//   );
// };