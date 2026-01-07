import { Link2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';

interface IntegrationIconProps {
  url: string | null;
}

export function IntegrationIcon({ url }: IntegrationIconProps) {
  if (!url) {
    return <span>{`-`}</span>;
  }

  return (
    //TODL : MAZE에서는 연결된 사이트의 파비콘을 보여줌. 이후 수정 고려
    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
      <Tooltip>
        <TooltipTrigger>
          <Link2 className="h-5 w-5 text-primary" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{url}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
