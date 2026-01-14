import { Link2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';

interface IntegrationIconProps {
  url: string | null;
  testId: string;
}

export const openPopup = (url: string, title: string, w: number, h: number) => {
  // 듀얼 모니터 환경을 고려한 부모 창의 좌표 계산
  const duplicateScale = window.devicePixelRatio || 1;

  // 브라우저의 현재 위치와 크기
  const windowLeft = window.screenLeft ?? window.screenX;
  const windowTop = window.screenTop ?? window.screenY;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth || screen.width;
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || screen.height;

  // 팝업을 중앙에 위치시키기 위한 좌표 계산
  const systemZoom = windowWidth / window.screen.availWidth;
  const left = (windowWidth - w) / 2 / systemZoom + windowLeft;
  const top = (windowHeight - h) / 2 / systemZoom + windowTop;

  // 윈도우 팝업 오픈
  const newWindow = window.open(
    url,
    title,
    `
      scrollbars=yes,
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left}
    `,
  );

  // 팝업이 차단되지 않고 열렸다면 포커스 이동
  if (newWindow) newWindow.focus();

  return newWindow;
};

export function IntegrationIcon({ url, testId }: IntegrationIconProps) {
  const handleIconClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (url) {
      openPopup(
        `${url}?utm-sdk-verify=true&test-id=${testId}`,
        'SDK Installation Verification',
        600,
        400,
      );
    }
  };

  if (!url) {
    return <span>{`-`}</span>;
  }

  return (
    //TODL : MAZE에서는 연결된 사이트의 파비콘을 보여줌. 이후 수정 고려
    <div
      className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded"
      onClick={handleIconClick}
    >
      <Tooltip>
        <TooltipTrigger>
          <Link2 className="text-primary h-5 w-5" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{url}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
