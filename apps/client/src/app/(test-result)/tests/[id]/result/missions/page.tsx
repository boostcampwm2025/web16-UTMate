'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export default function MissionResultsPage() {
  const params = useParams();
  const testId = params.id as string;
  const [selectedMissionId, setSelectedMissionId] = useState<number | null>(null);

  // TODO: API 연동 필요 - GET /api/tests/:testId
  const missions = [
    { id: 1, title: '로그인하기', description: '사용자가 로그인 페이지에서 로그인' },
    { id: 2, title: '대시보드 확인', description: '대시보드에서 주요 정보 확인' },
    { id: 3, title: '보고서 생성', description: '새로운 보고서를 생성' },
    { id: 4, title: '데이터 필터링', description: '테이블에서 데이터 필터링' },
    { id: 5, title: '설정 변경', description: '사용자 설정 변경' },
  ];

  // TODO: API 연동 필요 - GET /api/missions/:missionId/statistics
  const getMissionStatistics = (missionId: number) => ({
    successRate: { success: 20, total: 30, percentage: 66 },
    averageDuration: '5분',
    dropRate: 20,
    logs: [
      {
        id: 1,
        userId: 'user001',
        date: '2025-01-10 14:23',
        success: true,
        feedback: '쉽게 완료했습니다',
      },
      {
        id: 2,
        userId: 'user002',
        date: '2025-01-10 15:45',
        success: false,
        feedback: '버튼을 찾기 어려웠어요',
      },
      {
        id: 3,
        userId: 'user003',
        date: '2025-01-11 09:12',
        success: true,
        feedback: '직관적이었습니다',
      },
    ],
  });

  const selectedMission = missions.find((m) => m.id === selectedMissionId);
  const statistics = selectedMissionId ? getMissionStatistics(selectedMissionId) : null;

  return (
    <div className="space-y-6">
      {/* 미션 목록 */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">미션 목록</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => (
            <button
              key={mission.id}
              onClick={() => setSelectedMissionId(mission.id)}
              className={`rounded-lg border p-4 text-left transition-colors ${
                selectedMissionId === mission.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <h3 className="font-medium">
                {mission.id}. {mission.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{mission.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 미션 통계 */}
      {selectedMission && statistics && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-lg font-semibold">
              {selectedMission.id}. {selectedMission.title} 결과
            </h2>

            {/* 통계 카드 */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">성공률</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.successRate.success}/{statistics.successRate.total}{' '}
                    {statistics.successRate.percentage}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">평균 소요시간</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.averageDuration}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">이탈율</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.dropRate}%</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 로그 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle>로그 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">아이디</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">일시</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">성공여부</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">피드백</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.logs.map((log) => (
                      <tr
                        key={log.id}
                        className="cursor-pointer border-b transition-colors hover:bg-gray-50"
                        onClick={() => {
                          // TODO: missionResultId를 실제 API 응답에서 가져와야 함
                          window.location.href = `/missionresults/${log.id}`;
                        }}
                      >
                        <td className="px-4 py-3 text-sm">{log.userId}</td>
                        <td className="px-4 py-3 text-sm">{log.date}</td>
                        <td className="px-4 py-3 text-sm">
                          {log.success ? (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              성공
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-600">
                              <XCircle className="h-4 w-4" />
                              실패
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {log.feedback}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!selectedMissionId && (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">미션을 선택하면 상세 결과를 확인할 수 있습니다</p>
        </div>
      )}
    </div>
  );
}
