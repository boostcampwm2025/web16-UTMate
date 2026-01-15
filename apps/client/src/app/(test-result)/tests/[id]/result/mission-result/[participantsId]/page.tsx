'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Play, MousePointer, Clock, MapPin } from 'lucide-react';

interface EventLog {
  id: number;
  timestamp: number;
  type: string;
  description: string;
  url: string;
}

export default function MissionResultDetailPage() {
  const params = useParams();
  const testId = params.id as string;
  const participantsId = params.participantsId as string;
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // TODO: API 연동 필요 - GET /api/missionresults/:missionresultId (participantsId를 missionresultId로 전달)
  const missionResultData = {
    testId: testId,
    testTitle: '사용성 테스트 예제',
    missionId: 1,
    missionTitle: '로그인하기',
    userId: 'user001',
    persona: '20대 여성, 개발자',
    status: 'success',
    startTime: '2025-01-10 14:23:00',
    endTime: '2025-01-10 14:25:30',
    duration: '2분 30초',
    feedback: '쉽게 완료했습니다',
    missionDescription: '사용자가 로그인 페이지에서 이메일과 비밀번호를 입력하여 로그인합니다.',
    successCriteria: ['로그인 페이지 접근', '이메일 입력', '비밀번호 입력', '로그인 버튼 클릭'],
    // TODO: 실제로는 S3에서 jsonl 파일을 가져와서 파싱해야 함
    replayDataUrl: 's3://bucket/path/to/replay.jsonl',
    heatmapData: {
      clicks: 45,
      scrolls: 12,
      hovers: 89,
    },
  };

  // TODO: jsonl 파일을 파싱한 이벤트 로그 데이터
  const eventLogs: EventLog[] = [
    {
      id: 1,
      timestamp: 0,
      type: 'pageview',
      description: '로그인 페이지 접근',
      url: 'example.com/login',
    },
    {
      id: 2,
      timestamp: 5000,
      type: 'click',
      description: '이메일 입력 필드 클릭',
      url: 'example.com/login',
    },
    {
      id: 3,
      timestamp: 8000,
      type: 'input',
      description: '이메일 입력',
      url: 'example.com/login',
    },
    {
      id: 4,
      timestamp: 12000,
      type: 'click',
      description: '비밀번호 입력 필드 클릭',
      url: 'example.com/login',
    },
    {
      id: 5,
      timestamp: 15000,
      type: 'input',
      description: '비밀번호 입력',
      url: 'example.com/login',
    },
    {
      id: 6,
      timestamp: 18000,
      type: 'click',
      description: '로그인 버튼 클릭',
      url: 'example.com/login',
    },
    {
      id: 7,
      timestamp: 20000,
      type: 'pageview',
      description: '대시보드 페이지로 이동',
      url: 'example.com/dashboard',
    },
  ];

  const formatTimestamp = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEventClick = (eventId: number) => {
    setSelectedEventId(eventId);
    // TODO: rrweb 플레이어의 시점을 해당 timestamp로 이동
    const event = eventLogs.find((e) => e.id === eventId);
    if (event) {
      console.log(`영상 시점을 ${formatTimestamp(event.timestamp)}로 이동`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/tests/${testId}/result`}>
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">
              {missionResultData.missionTitle} - {missionResultData.userId}
            </h1>
            <p className="text-sm text-muted-foreground">{missionResultData.persona}</p>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar - 테스트 정보 */}
        <aside className="w-80 border-r bg-white p-6">
          <div className="space-y-6">
            {/* 미션 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">미션 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">미션 설명</p>
                  <p className="mt-1">{missionResultData.missionDescription}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">성공 기준</p>
                  <ul className="mt-1 list-inside list-disc space-y-1">
                    {missionResultData.successCriteria.map((criterion, index) => (
                      <li key={index}>{criterion}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 실행 결과 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">실행 결과</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상태</span>
                  <span
                    className={`font-medium ${
                      missionResultData.status === 'success'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {missionResultData.status === 'success' ? '성공' : '실패'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">소요 시간</span>
                  <span className="font-medium">{missionResultData.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">시작 시간</span>
                  <span className="font-medium">{missionResultData.startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">종료 시간</span>
                  <span className="font-medium">{missionResultData.endTime}</span>
                </div>
              </CardContent>
            </Card>

            {/* 히트맵 데이터 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">히트맵 데이터</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">클릭</span>
                  <span className="font-medium">{missionResultData.heatmapData.clicks}회</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">스크롤</span>
                  <span className="font-medium">{missionResultData.heatmapData.scrolls}회</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">호버</span>
                  <span className="font-medium">{missionResultData.heatmapData.hovers}회</span>
                </div>
              </CardContent>
            </Card>

            {/* 피드백 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">사용자 피드백</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>{missionResultData.feedback}</p>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content - 리플레이 & 이벤트 로그 */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* 리플레이 플레이어 */}
            <Card>
              <CardHeader>
                <CardTitle>세션 리플레이</CardTitle>
              </CardHeader>
              <CardContent>
                {/* TODO: rrweb 플레이어 통합 */}
                <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-900">
                  <div className="text-center text-white">
                    <Play className="mx-auto mb-2 h-12 w-12" />
                    <p className="text-sm">rrweb 리플레이 플레이어</p>
                    <p className="mt-1 text-xs text-gray-400">
                      S3: {missionResultData.replayDataUrl}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 이벤트 타임라인 */}
            <Card>
              <CardHeader>
                <CardTitle>사용 이력 타임라인</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {eventLogs.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => handleEventClick(event.id)}
                      className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                        selectedEventId === event.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex h-8 w-16 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-medium">
                        {formatTimestamp(event.timestamp)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {event.type === 'click' && (
                            <MousePointer className="h-4 w-4 text-blue-500" />
                          )}
                          {event.type === 'pageview' && (
                            <MapPin className="h-4 w-4 text-green-500" />
                          )}
                          {event.type === 'input' && (
                            <Clock className="h-4 w-4 text-purple-500" />
                          )}
                          <span className="text-sm font-medium">{event.description}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{event.url}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
