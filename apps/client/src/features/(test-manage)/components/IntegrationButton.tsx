import { Link2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { Button } from '@/shared/components/ui/button';
import { openPopup } from '@/shared/utils/window';

interface IntegrationButtonProps {
  url: string | null;
  testId: string;
}

export function IntegrationButton({ url, testId }: IntegrationButtonProps) {
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
    return <span>-</span>;
  }

  return (
    //TODL : MAZE에서는 연결된 사이트의 파비콘을 보여줌. 이후 수정 고려
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className="bg-primary/10 mx-auto flex h-8 w-8 items-center justify-center rounded"
          onClick={handleIconClick}
        >
          <Link2 className="text-primary h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{url}</p>
      </TooltipContent>
    </Tooltip>
  );
}
