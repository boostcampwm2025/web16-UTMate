'use client';

import { useRouter } from 'next/navigation';
import { User as UserIcon } from 'lucide-react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

import { Button } from '@/shared/components/ui/button';
import { getPersona } from '@/features/(auth)/apis/client';
import { useDialogStore } from '@/shared/stores/useDialogStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';

export function PersonaButton() {
  const router = useRouter();
  const { confirm } = useDialogStore();

  const [, setGender] = useQueryState('gender', parseAsString);
  const [, setAgeGroup] = useQueryState('age', parseAsString);
  const [, setInterests] = useQueryState(
    'interests',
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const handleClick = async () => {
    try {
      const persona = await getPersona();

      if (!persona) {
        confirm('페르소나 없음.', '페르소나가 없습니다. 페르소나를 생성해주세요.', null, {
          confirmText: '프로필 페이지 이동',
          onConfirm: () => router.push('/profile'),
        });
        return;
      }

      await Promise.all([
        setGender(persona.gender),
        setAgeGroup(persona.ageGroup),
        setInterests(persona.interests),
      ]);
    } catch (error) {
      console.error('Failed to fetch persona:', error);
      confirm('오류', '페르소나를 불러오는 중 오류가 발생했습니다.', null, {
        confirmText: '확인',
        isAlert: true,
      });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={handleClick} className="self-start md:self-end">
          <UserIcon className="mr-2 h-4 w-4" />
          맞춤보기
        </Button>
      </TooltipTrigger>
      <TooltipContent>내 페르소나에 맞춰 테스트를 추천받습니다.</TooltipContent>
    </Tooltip>
  );
}
