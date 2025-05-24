type DeviceType = 'phone' | 'tablet' | 'desktop';

export function getDeviceType(userAgent: string): DeviceType {
  if (/mobile/i.test(userAgent)) return 'phone';
  if (/tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
}