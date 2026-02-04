import { Monitor, Smartphone, Tablet } from 'lucide-react';
import type { UAInfo } from '../types';

interface UAInfoDisplayProps {
  uaInfo?: UAInfo;
  compact?: boolean;
}

export function UAInfoDisplay({ uaInfo, compact = false }: UAInfoDisplayProps) {
  if (!uaInfo) {
    return <span className="text-muted-foreground text-sm italic">정보 없음</span>;
  }

  const getDeviceIcon = () => {
    const deviceType = uaInfo.device.type;
    if (deviceType === 'mobile') return <Smartphone className="h-4 w-4" />;
    if (deviceType === 'tablet') return <Tablet className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const browserInfo = uaInfo.browser.name
    ? `${uaInfo.browser.name}${uaInfo.browser.version ? ` ${uaInfo.browser.version}` : ''}`
    : '알 수 없음';

  const osInfo = uaInfo.os.name
    ? `${uaInfo.os.name}${uaInfo.os.version ? ` ${uaInfo.os.version}` : ''}`
    : '알 수 없음';

  const deviceInfo = uaInfo.device.type || 'desktop';

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {getDeviceIcon()}
        <span className="truncate">{browserInfo}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        {getDeviceIcon()}
        <span className="text-muted-foreground font-medium">디바이스:</span>
        <span className="text-gray-900 capitalize">{deviceInfo}</span>
      </div>
      <div>
        <span className="text-muted-foreground font-medium">브라우저:</span>
        <span className="ml-2 text-gray-900">{browserInfo}</span>
      </div>
      <div>
        <span className="text-muted-foreground font-medium">OS:</span>
        <span className="ml-2 text-gray-900">{osInfo}</span>
      </div>
    </div>
  );
}
