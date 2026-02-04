import Link from 'next/link';
import { Clock, Target, Users } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

import type { SearchTestResult } from '../types';

interface TestSearchResultItemProps {
  test: SearchTestResult;
  onClick: () => void;
}

export function TestSearchResultItem({ test, onClick }: TestSearchResultItemProps) {
  return (
    <Card
      className="group flex h-full cursor-pointer flex-col gap-4"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${test.title} 테스트 상세 보기`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="decoration-primary mb-2 line-clamp-1 text-xl decoration-1 underline-offset-4 transition-all duration-300 group-hover:underline">
              {test.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">{test.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-muted-foreground grid grid-cols-2 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          <span>{test.missionsCount}개 미션</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{test.totalTimeMinutes}분</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{test.participantsCount}명 참여</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {test.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </CardFooter>
    </Card>
  );
}

const TagBadge = ({ tag }: { tag: string }) => {
  return (
    <Badge key={tag} variant="outline">
      {tag}
    </Badge>
  );
};
