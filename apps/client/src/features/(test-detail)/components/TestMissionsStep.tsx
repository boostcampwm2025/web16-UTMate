'use client';

import { Plus, Trash2 } from 'lucide-react';

import type { TestMission } from '@/features/(test-manage)/types';
import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

interface TestMissionsStepProps {
  missions: TestMission[];
  onAddMission: () => void;
  onUpdateMission: (id: number, mission: Partial<TestMission>) => void;
  onDeleteMission: (id: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function TestMissionsStep({
  missions,
  onAddMission,
  onUpdateMission,
  onDeleteMission,
  onPrev,
  onNext,
}: TestMissionsStepProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold">미션 설정</h2>
          <p className="text-gray-600">
            테스트 참가자가 수행할 미션을 추가하고 관리하세요.
          </p>
        </div>
        <Button onClick={onAddMission}>
          <Plus className="mr-2 size-4" />
          미션 추가
        </Button>
      </div>

      {missions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <div className="text-4xl">📋</div>
            <h3 className="text-lg font-semibold text-gray-700">아직 미션이 없습니다</h3>
            <p className="text-sm text-gray-500">
              첫 번째 미션을 추가하여 테스트를 시작하세요.
            </p>
            <Button onClick={onAddMission}>
              <Plus className="mr-2 size-4" />
              미션 추가
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {missions.map((mission, index) => (
            <div key={mission.id} className="rounded-lg border bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">미션 {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteMission(mission.id)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="mr-1 size-4" />
                  삭제
                </Button>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor={`mission-name-${mission.id}`}>미션 이름 *</FieldLabel>
                  <Input
                    id={`mission-name-${mission.id}`}
                    placeholder="예: 로그인 페이지 찾기"
                    value={mission.name}
                    onChange={(e) => onUpdateMission(mission.id, { name: e.target.value })}
                  />
                  <FieldDescription>참가자에게 보여질 미션 제목입니다.</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor={`mission-description-${mission.id}`}>
                    미션 설명
                  </FieldLabel>
                  <Textarea
                    id={`mission-description-${mission.id}`}
                    placeholder="미션에 대한 자세한 설명을 입력하세요"
                    value={mission.description}
                    onChange={(e) =>
                      onUpdateMission(mission.id, { description: e.target.value })
                    }
                    rows={3}
                    className="resize-none"
                  />
                  <FieldDescription>참가자가 무엇을 해야 하는지 설명합니다.</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor={`mission-url-${mission.id}`}>대상 URL</FieldLabel>
                  <Input
                    id={`mission-url-${mission.id}`}
                    placeholder="https://example.com/login"
                    value={mission.url}
                    onChange={(e) => onUpdateMission(mission.id, { url: e.target.value })}
                  />
                  <FieldDescription>
                    미션을 수행할 페이지 URL입니다. (선택사항)
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor={`mission-duration-${mission.id}`}>
                    예상 소요시간
                  </FieldLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`mission-duration-${mission.id}`}
                      type="number"
                      min="1"
                      placeholder="5"
                      value={mission.estimatedDuration || ''}
                      onChange={(e) =>
                        onUpdateMission(mission.id, {
                          estimatedDuration: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      className="w-24"
                    />
                    <span className="text-sm text-gray-600">분</span>
                  </div>
                  <FieldDescription>
                    참가자가 미션을 완료하는데 걸리는 예상 시간입니다. (선택사항)
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </div>
          ))}
        </div>
      )}

      <div className="border-t pt-6">
        <p className="mb-6 text-sm text-gray-500">
          💡 미션은 참가자가 순차적으로 수행하게 됩니다.
        </p>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            이전
          </Button>
          <Button onClick={onNext}>다음</Button>
        </div>
      </div>
    </div>
  );
}

