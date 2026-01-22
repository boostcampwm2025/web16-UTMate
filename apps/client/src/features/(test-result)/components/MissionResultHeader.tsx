import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import type { MissionResultWithParticipant, MissionResultDetail } from '../types';

interface MissionResultHeaderProps {
  testId: string;
  missionResultData: MissionResultWithParticipant | MissionResultDetail;
}

function isMissionResultDetail(
  data: MissionResultWithParticipant | MissionResultDetail
): data is MissionResultDetail {
  return 'presignedUrl' in data;
}

export function MissionResultHeader({ testId, missionResultData }: MissionResultHeaderProps) {
  const isDetail = isMissionResultDetail(missionResultData);
  
  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/tests/${testId}/result`}>
            <ArrowLeft />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold">
            {isDetail 
              ? `미션 결과: ${missionResultData.missionId}`
              : `${missionResultData.missionId} - ${missionResultData.participantId}`
            }
          </h1>
          {!isDetail && (
            <p className="text-muted-foreground text-sm">{missionResultData.persona}</p>
          )}
        </div>
      </div>
    </header>
  );
}