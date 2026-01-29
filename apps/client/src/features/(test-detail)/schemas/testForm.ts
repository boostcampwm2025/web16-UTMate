import { z } from 'zod';

import type { Interest } from '@/features/(auth)/types';

import { MAX_MISSIONS } from '../constants';

// 미션 스키마
export const missionSchema = z.object({
  publicId: z.string().optional(),
  order: z.number(),
  name: z.string().min(1, '미션 이름을 입력해주세요.'),
  description: z.string().min(1, '미션 설명을 입력해주세요.'),
  missionUrl: z.string().min(1, '대상 URL을 입력해주세요.').url('올바른 URL 형식이 아닙니다.'),
  estimatedDuration: z
    .number({ message: '예상 소요시간을 입력해주세요.' })
    .min(1, '예상 소요시간은 1분 이상이어야 합니다.'),
});

// 테스트 폼 스키마
export const testFormSchema = z
  .object({
    title: z
      .string()
      .min(1, '테스트 이름을 입력해주세요.')
      .min(2, '테스트 이름은 최소 2자 이상이어야 합니다.'),
    description: z.string(),
    url: z.string().min(1, '서비스 URL을 입력해주세요.').url('올바른 URL 형식이 아닙니다.'),
    missions: z
      .array(missionSchema)
      .max(MAX_MISSIONS, `미션은 최대 ${MAX_MISSIONS}개까지만 추가할 수 있습니다.`),
    // 타겟 페르소나 설정
    isPublic: z.boolean(), // 공개/비공개 필수 선택
    targetGenders: z.array(z.string()), // 필수
    targetAges: z.array(z.string()), // 필수
    targetInterests: z.array(z.string() as z.ZodType<Interest>), // 선택사항
  })
  .superRefine((data, ctx) => {
    // 공개 테스트가 아닐 경우 타겟 페르소나 검증 생략
    if (!data.isPublic) {
      return;
    }

    // 타겟 페르소나 검증
    if (data.targetGenders.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '최소 한 개 이상의 성별을 선택해주세요.',
      });
    }

    if (data.targetAges.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '최소 한 개 이상의 연령대를 선택해주세요.',
      });
    }
  });

export type TestFormValues = z.infer<typeof testFormSchema>;
export type MissionFormValues = z.infer<typeof missionSchema>;
