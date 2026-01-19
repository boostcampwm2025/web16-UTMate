'use client';

import { useRouter } from 'next/navigation';

import type { MissionResultWithParticipant } from '../types';

interface MissionResultListProps {
  testId: string;
  missionLogs: MissionResultWithParticipant[];
}

export function MissionResultList({ testId, missionLogs }: MissionResultListProps) {
  const router = useRouter();

  const handleRowClick = (participantId: string) => {
    router.push(`/tests/${testId}/result/mission-result/${participantId}`);
  };

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-gray-800">로그 목록</h3>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">아이디</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600 text-center">일시</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600 text-center">성공여부</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">피드백</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {missionLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-400">
                  해당 미션에 대한 결과가 없습니다.
                </td>
              </tr>
            ) : (
              missionLogs.map((log) => (
                <tr
                  key={log.participantId}
                  onClick={() => handleRowClick(log.participantId)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{log.participantId}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center">{log.createdAt || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    {log.status === 'SUCCESS' ? (
                      <span className="inline-flex items-center text-green-600 font-bold">O</span>
                    ) : log.status === 'FAILURE' ? (
                      <span className="inline-flex items-center text-red-600 font-bold">X</span>
                    ) : log.status === 'DROPPED' ? (
                      <span className="inline-flex items-center text-gray-500 font-bold">이탈</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {log.feedback || <span className="text-gray-300 italic">피드백 없음</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}