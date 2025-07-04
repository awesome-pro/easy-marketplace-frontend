import { v4 as uuidv4 } from 'uuid';
import { UAParser } from 'ua-parser-js';

const DEVICE_ID_KEY = 'device_id';

// Define the device type enum to match backend
export enum DeviceType {
  IOS = 'ios',
  ANDROID = 'android',
  WEB = 'web'
}

/**
 * Determines the device type based on user agent information
 * @returns DeviceType enum value
 */
const determineDeviceType = (): DeviceType => {
  const parser = new UAParser();
  const result = parser.getResult();
  
  // Check OS name for mobile devices
  const osName = result.os.name?.toLowerCase() || '';
  if (osName.includes('ios') || osName.includes('iphone') || osName.includes('ipad')) {
    return DeviceType.IOS;
  }
  if (osName.includes('android')) {
    return DeviceType.ANDROID;
  }

  // If no mobile OS detected, check device type
  const deviceType = result.device.type?.toLowerCase() || '';
  if (deviceType.includes('mobile') || deviceType.includes('tablet')) {
    // If mobile but not iOS, default to Android
    if (result.os.name?.toLowerCase().includes('windows')) {
      return DeviceType.WEB;
    }
    return DeviceType.ANDROID;
  }

  // Default to web for desktop browsers
  return DeviceType.WEB;
};

export const getDeviceInfo = () => {
  // Get or create device ID
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  // Parse user agent
  const parser = new UAParser();
  const result = parser.getResult();
  const deviceType = determineDeviceType();

  // Format device name
  const browserName = result.browser.name || 'Unknown Browser';
  const osName = result.os.name || 'Unknown OS';
  const deviceName = `${browserName} on ${osName}`;

  return {
    deviceId,
    deviceType,
    deviceName
  };
};
