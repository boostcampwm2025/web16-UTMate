import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function BackToWorkspaceButton() {
  return (
    <Button variant="outline" asChild>
      <Link href="/workspace">
        <ArrowLeft />
      </Link>
    </Button>
  );
}
