'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

type MissionStatus = 'success' | 'failure' | 'dropped' | 'in_progress';

interface MissionResult {
  missionId: number;
  missionTitle: string;
  status: MissionStatus;
  missionResultId: number;
}

interface Participant {
  id: string;
  userId: string;
  persona: string;
  missionResults: MissionResult[];
}

export default function ParticipantsResultsPage() {
  const params = useParams();
  const testId = params.id as string;

  // TODO: API 연동 필요 - GET /api/tests/:testId/participants
  const participants: Participant[] = [
    {
      id: '1',
      userId: 'user001',
      persona: '20대 여성, 개발자',
      missionResults: [
        { missionId: 1, missionTitle: '로그인', status: 'success', missionResultId: 101 },
        { missionId: 2, missionTitle: '대시보드', status: 'success', missionResultId: 102 },
        { missionId: 3, missionTitle: '보고서', status: 'failure', missionResultId: 103 },
        { missionId: 4, missionTitle: '필터링', status: 'success', missionResultId: 104 },
        { missionId: 5, missionTitle: '설정', status: 'dropped', missionResultId: 105 },
      ],
    },
    {
      id: '2',
      userId: 'user002',
      persona: '30대 남성, 기획자',
      missionResults: [
        { missionId: 1, missionTitle: '로그인', status: 'success', missionResultId: 201 },
        { missionId: 2, missionTitle: '대시보드', status: 'success', missionResultId: 202 },
        { missionId: 3, missionTitle: '보고서', status: 'success', missionResultId: 203 },
        { missionId: 4, missionTitle: '필터링', status: 'failure', missionResultId: 204 },
        { missionId: 5, missionTitle: '설정', status: 'in_progress', missionResultId: 205 },
      ],
    },
    {
      id: '3',
      userId: 'user003',
      persona: '40대 여성, 디자이너',
      missionResults: [
        { missionId: 1, missionTitle: '로그인', status: 'success', missionResultId: 301 },
        { missionId: 2, missionTitle: '대시보드', status: 'dropped', missionResultId: 302 },
        { missionId: 3, missionTitle: '보고서', status: 'dropped', missionResultId: 303 },
        { missionId: 4, missionTitle: '필터링', status: 'dropped', missionResultId: 304 },
        { missionId: 5, missionTitle: '설정', status: 'dropped', missionResultId: 305 },
      ],
    },
  ];

  const getStatusColor = (status: MissionStatus) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'failure':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'dropped':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      case 'in_progress':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    }
  };

  const getStatusIcon = (status: MissionStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-3 w-3" />;
      case 'failure':
        return <XCircle className="h-3 w-3" />;
      case 'dropped':
        return <AlertCircle className="h-3 w-3" />;
      case 'in_progress':
        return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusText = (status: MissionStatus) => {
    switch (status) {
      case 'success':
        return '성공';
      case 'failure':
        return '실패';
      case 'dropped':
        return '이탈';
      case 'in_progress':
        return '진행중';
    }
  };

  const handleMissionClick = (missionResultId: number) => {
    window.location.href = `/missionresults/${missionResultId}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-semibold">참여자 목록</h2>

        <div className="space-y-4">
          {participants.map((participant) => (
            <Card key={participant.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{participant.userId}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{participant.persona}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {participant.missionResults.map((result) => (
                    <button
                      key={result.missionId}
                      onClick={() => handleMissionClick(result.missionResultId)}
                      className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-all hover:shadow-sm ${getStatusColor(
                        result.status
                      )}`}
                    >
                      {getStatusIcon(result.status)}
                      <span>
                        {result.missionId}번 {result.missionTitle}
                      </span>
                      <span className="ml-1">({getStatusText(result.status)})</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 범례 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">상태 범례</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3" />
              </div>
              <span className="text-sm">성공</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-red-100 text-red-800">
                <XCircle className="h-3 w-3" />
              </div>
              <span className="text-sm">실패</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-800">
                <AlertCircle className="h-3 w-3" />
              </div>
              <span className="text-sm">이탈</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-yellow-100 text-yellow-800">
                <Clock className="h-3 w-3" />
              </div>
              <span className="text-sm">진행중</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
