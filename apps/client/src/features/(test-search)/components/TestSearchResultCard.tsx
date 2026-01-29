import Link from 'next/link';
import { Clock, Target, Users } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

import type { SearchTestResult } from '../types';

interface TestSearchResultCardProps {
  test: SearchTestResult;
}

export function TestSearchResultCard({ test }: TestSearchResultCardProps) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="mb-2 line-clamp-2 text-xl">{test.title}</CardTitle>
            <CardDescription className="line-clamp-3">{test.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-4 flex flex-wrap gap-2">
          {test.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <div className="text-muted-foreground grid grid-cols-2 gap-y-2 text-sm">
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button asChild className="mr-0" variant="outline">
          <Link href={`/tests/${test.id}`}>참여하기</Link>
        </Button>
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
