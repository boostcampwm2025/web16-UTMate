'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { LayoutDashboard, Target, Users, ChevronDown } from 'lucide-react';

import { cn } from '@/shared/utils';
import { CLIENT_BASE_URL } from '@/shared/constants/api';
import { clientFetcher } from '@/shared/utils/fetcher/clientFetcher';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';

import { getTestParticipantsResults } from '../apis/client';
import type { TestDetail } from '@/features/(test-manage)/types';

// 테스트 상세 정보 가져오기 (미션 목록 포함)
const getTestDetail = async (testId: string): Promise<TestDetail> => {
  return clientFetcher<TestDetail>(`${CLIENT_BASE_URL}/tests/${testId}`);
};

// 상대 시간 포맷 (예: 1일전, 3일전)
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '1일전';
  return `${diffDays}일전`;
}

export function TestResultSidebar() {
  const params = useParams();
  const pathname = usePathname();
  const testId = params.id as string;

  // 아코디언 열림 상태
  const [isMissionsOpen, setIsMissionsOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);

  // 테스트 상세 정보 (미션 목록)
  const { data: testDetail } = useSuspenseQuery({
    queryKey: ['testDetail', testId],
    queryFn: () => getTestDetail(testId),
  });

  // 참여자 목록
  const { data: participants } = useSuspenseQuery({
    queryKey: ['testParticipantsResults', testId],
    queryFn: () => getTestParticipantsResults(testId),
  });

  const isSummaryActive = pathname === `/tests/${testId}/result`;
  const isMissionsActive = pathname.startsWith(`/tests/${testId}/result/missions`);
  const isParticipantsActive = pathname.startsWith(`/tests/${testId}/result/participants`);

  return (
    <aside className="bg-background w-64 shrink-0 overflow-y-auto border-r p-2">
      <div className="flex flex-col gap-1">
        {/* 요약 */}
        <Link
          href={`/tests/${testId}/result`}
          className={cn(
            'flex w-full items-center gap-2 rounded-md p-3 text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            isSummaryActive && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>요약</span>
        </Link>

        {/* 미션별 보기 (Collapsible) */}
        <Collapsible open={isMissionsOpen} onOpenChange={setIsMissionsOpen}>
          <CollapsibleTrigger
            className={cn(
              'flex w-full items-center justify-between rounded-md p-3 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              isMissionsActive && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
            )}
          >
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>미션별 보기</span>
            </div>
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', isMissionsOpen && 'rotate-180')}
            />
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="ml-4 mt-1 flex flex-col gap-1">
              {testDetail.missions.map((mission) => (
                <Link
                  key={mission.publicId}
                  href={`/tests/${testId}/result/missions/${mission.publicId}`}
                  className={cn(
                    'rounded-md p-2 text-sm transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    pathname === `/tests/${testId}/result/missions/${mission.publicId}` &&
                      'bg-primary/10 text-primary',
                  )}
                >
                  미션 {mission.order} : {mission.name}
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* 참여자별 보기 (Collapsible) */}
        <Collapsible open={isParticipantsOpen} onOpenChange={setIsParticipantsOpen}>
          <CollapsibleTrigger
            className={cn(
              'flex w-full items-center justify-between rounded-md p-3 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              isParticipantsActive &&
                'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
            )}
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>참여자별 보기</span>
            </div>
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', isParticipantsOpen && 'rotate-180')}
            />
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="ml-4 mt-1 flex flex-col gap-1">
              {participants.map((participant, index) => {
                const createdAt = participant.missionResults[0]?.createdAt;
                return (
                  <Link
                    key={participant.participantId}
                    href={`/tests/${testId}/result/participants/${participant.participantId}`}
                    className={cn(
                      'flex items-center justify-between rounded-md p-2 text-sm transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      pathname ===
                        `/tests/${testId}/result/participants/${participant.participantId}` &&
                        'bg-primary/10 text-primary',
                    )}
                  >
                    <span>참여자 {index + 1}</span>
                    {createdAt && (
                      <span className="text-muted-foreground text-xs">
                        {formatRelativeTime(createdAt)}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </aside>
  );
}
