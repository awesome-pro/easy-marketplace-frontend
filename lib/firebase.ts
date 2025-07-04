// firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  Messaging,
} from "firebase/messaging";
import { toast } from "sonner";
import api from "./axios";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDa_E1pfSGw1xIu_1oZbZ0sdPxAx49WXJM",
  authDomain: "estate-f8581.firebaseapp.com",
  projectId: "estate-f8581",
  storageBucket: "estate-f8581.firebasestorage.app",
  messagingSenderId: "297172447989",
  appId: "1:297172447989:web:e38ad1e8ec9c05e9190bbc",
  measurementId: "G-BBXTQNWTEX",
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize messaging (singleton for reuse)
let messagingInstance: Messaging | null = null;
const initializeMessaging = async (): Promise<Messaging | null> => {
  if (messagingInstance) return messagingInstance;
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn("Firebase Messaging is not supported in this browser.");
      return null;
    }
    messagingInstance = getMessaging(app);
    return messagingInstance;
  } catch (error) {
    console.error("Error initializing Firebase Messaging:", error);
    return null;
  }
};

// Fetch FCM token with proper error handling and retries
export const fetchToken = async (maxRetries = 3): Promise<string | null> => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const messaging = await initializeMessaging();
      if (!messaging) return null;

      const registration = await registerServiceWorker();
      if (!registration) return null;

      // Request the token with proper VAPID key
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (!currentToken) {
        throw new Error('No token received from Firebase');
      }

      // Validate token format before returning
      // Format: <token_id>:APA91b<base64_string>
      if (!currentToken.match(/^[A-Za-z0-9_-]+:APA91b[A-Za-z0-9_-]+$/)) {
        console.error('Invalid token format received:', currentToken);
        throw new Error('Invalid token format received from Firebase');
      }

      console.log('Valid FCM token generated:', currentToken);
      return currentToken;
    } catch (error) {
      console.error(`Error fetching FCM token (attempt ${retries + 1}/${maxRetries}):`, error);
      retries++;
      
      if (retries === maxRetries) {
        console.error('Max retries reached for FCM token fetch');
        return null;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
  
  return null;
};

// Register service worker
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    console.warn("Service Worker not supported in this environment.");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
      scope: "/",
    });
    console.log("Service Worker registered:", registration);
    await navigator.serviceWorker.ready; // Ensure the SW is active
    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
};

// Request notification permission and register device with proper validation
export const requestNotificationPermission = async (
  deviceInfo?: {
    deviceId: string;
    deviceType: string;
    deviceName?: string;
  }
): Promise<{ token: string | null; error?: string }> => {
  try {
    if (!('Notification' in window)) {
      return { token: null, error: 'Notifications not supported in this browser' };
    }

    if (Notification.permission === 'denied') {
      return { token: null, error: 'Notification permission denied' };
    }

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return { token: null, error: 'Notification permission not granted' };
      }
    }

    const token = await fetchToken();
    if (!token) {
      return { token: null, error: 'Failed to obtain FCM token' };
    }

    if (deviceInfo) {
      const deviceResponse = await api.post('/device/register', {
        fcmToken: token,
        ...deviceInfo
      });
      console.log('Device registered successfully:', deviceResponse.data);
    }

    return { token };
  } catch (error: any) {
    console.error('Error in requestNotificationPermission:', error);
    return { token: null, error: error.message };
  }
};

// Unregister device
export const unregisterDevice = async (deviceId: string): Promise<boolean> => {
  try {
    const messaging = await initializeMessaging();
    if (!messaging) return false;

    await deleteToken(messaging);
    const { data } = await api.post('/device/unregister', { deviceId });
    return !!data?.unregisterDevice;
  } catch (error) {
    console.error("Error unregistering device:", error);
    return false;
  }
};

// Foreground message listener
export const onMessageListener = (): Promise<any> =>
  new Promise(async (resolve) => {
    const messaging = await initializeMessaging();
    if (!messaging) {
      resolve(null);
      return;
    }

    onMessage(messaging, (payload) => {
      console.log("Foreground message:", payload);
      if (payload.notification) {
        toast(payload.notification.title, {
          description: payload.notification.body,
          action: {
            label: "View",
            onClick: () => (window.location.href = payload.data?.url || "/"),
          },
        });
      }
      resolve(payload);
    });
  });

export { app, initializeMessaging as messaging };