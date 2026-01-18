'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';

export default function TestResultSummaryPage() {
  const params = useParams();
  const testId = params.id as string;

  // TODO: API 연동 필요 - GET /api/tests/:testId/summary
  const summaryData = {
    title: '사용성 테스트 예제',
    description: '신규 대시보드 UI/UX 개선을 위한 사용성 테스트입니다.',
    startDate: '2025-01-01',
    endDate: '2025-01-15',
    totalParticipants: 50,
    completedParticipants: 45,
    totalMissions: 5,
    averageCompletionRate: 85,
    averageDuration: '12분 30초',
    missions: [
      { id: 1, title: '로그인하기', successRate: 95 },
      { id: 2, title: '대시보드 확인', successRate: 88 },
      { id: 3, title: '보고서 생성', successRate: 75 },
      { id: 4, title: '데이터 필터링', successRate: 82 },
      { id: 5, title: '설정 변경', successRate: 78 },
    ],
    feedbacks: [
      '사용하기 편리했습니다',
      '로딩이 느렸습니다',
      '메뉴 구조가 직관적이에요',
    ],
  };

  return (
    <div className="space-y-6">
      {/* 테스트 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>{summaryData.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{summaryData.description}</p>
        </CardContent>
      </Card>

      {/* 주요 지표 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">테스트 기간</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryData.startDate} ~ {summaryData.endDate}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">참여자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryData.completedParticipants} / {summaryData.totalParticipants}
            </div>
            <p className="text-xs text-muted-foreground">
              완료율{' '}
              {Math.round(
                (summaryData.completedParticipants / summaryData.totalParticipants) * 100
              )}
              %
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 완료율</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.averageCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              전체 {summaryData.totalMissions}개 미션
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 소요 시간</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.averageDuration}</div>
          </CardContent>
        </Card>
      </div>

      {/* 미션별 성공률 */}
      <Card>
        <CardHeader>
          <CardTitle>미션별 성공률</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summaryData.missions.map((mission) => (
              <div key={mission.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {mission.id}. {mission.title}
                  </span>
                  <span className="text-sm font-bold">{mission.successRate}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${mission.successRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 피드백 요약 */}
      <Card>
        <CardHeader>
          <CardTitle>주요 피드백</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {summaryData.feedbacks.map((feedback, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                • {feedback}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
