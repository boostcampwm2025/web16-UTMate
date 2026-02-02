import Link from 'next/link';
import { Clock, Target, Users, ChevronRight } from 'lucide-react';

import { DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

import type { SearchTestResult } from '../types';

interface SearchResultDetailProps {
  test: SearchTestResult;
}

export function SearchResultDetail({ test }: SearchResultDetailProps) {
  return (
    <div className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle className="text-2xl leading-tight font-bold tracking-tight">
          {test.title}
        </DialogTitle>
      </DialogHeader>

      <div className="gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-muted-foreground text-base font-medium">설명 상세</h3>
          <p className="text-foreground text-sm leading-relaxed">{test.description}</p>
        </div>
      </div>
      <div className="gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-muted-foreground text-base font-medium">테스트 정보</h3>
          <div className="flex items-center gap-2">
            <Target className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">{test.missionsCount}개 미션</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">{test.totalTimeMinutes}분</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">{test.participantsCount}명 참여</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-muted-foreground text-base font-medium">태그 목록</h3>
        <div className="mb-3 flex items-center gap-2">
          {test.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <DialogFooter className="mt-2 sm:justify-end">
        <Button asChild size="lg" className="w-full font-semibold sm:w-auto">
          <Link href={`/participate/${test.id}`} className="flex items-center justify-center gap-2">
            테스트 참여하기
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </DialogFooter>
    </div>
  );
}
