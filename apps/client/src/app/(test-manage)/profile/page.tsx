'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Separator } from '@/shared/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { getCurrentUser, deleteUser } from '@/features/(auth)/apis';
import type { User } from '@/features/(auth)/types';

/**
 * 마이페이지 - 프로필 정보 및 페르소나 설정
 *
 * 기능:
 * - 사용자 프로필 정보 표시 (GitHub 계정 정보)
 * - 페르소나 입력 (사용자 테스트 관련 정보)
 * - 회원 탈퇴
 */

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [persona, setPersona] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteUser();
      router.push('/login');
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleSavePersona = () => {
    // TODO: 페르소나 저장 API 연동
    console.log('페르소나 저장:', persona);
    alert('페르소나가 저장되었습니다.');
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userInitials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">프로필</h1>
        <p className="text-muted-foreground">계정 정보를 확인하고 페르소나를 설정하세요.</p>
      </div>

      <Separator />

      {/* 프로필 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>프로필 정보</CardTitle>
          <CardDescription>GitHub 계정으로 로그인된 정보입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">GitHub ID: {user.githubId}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" value={user.name} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" value={user.email} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="joined">가입일</Label>
              <Input
                id="joined"
                value={new Date(user.createdAt).toLocaleDateString('ko-KR')}
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 페르소나 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>페르소나 설정</CardTitle>
          <CardDescription>
            사용자 테스트를 수행할 때 참고할 페르소나 정보를 입력하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="persona">페르소나 (선택사항)</Label>
            <Textarea
              id="persona"
              placeholder="예: 20대 직장인, IT 업계 종사자, 모바일 앱 사용 빈도 높음..."
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              테스트 참여 시 참고할 수 있는 사용자 특성을 입력하세요.
            </p>
          </div>
          <Button onClick={handleSavePersona}>페르소나 저장</Button>
        </CardContent>
      </Card>

      {/* 위험 영역 */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">위험 영역</CardTitle>
          <CardDescription>
            계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">회원 탈퇴</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>정말 탈퇴하시겠습니까?</DialogTitle>
                <DialogDescription>
                  계정을 삭제하면 다음 데이터가 영구적으로 삭제됩니다:
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>프로필 정보</li>
                    <li>생성한 테스트</li>
                    <li>참여한 테스트 기록</li>
                    <li>모든 활동 내역</li>
                  </ul>
                  <p className="mt-4 font-semibold text-destructive">
                    이 작업은 되돌릴 수 없습니다.
                  </p>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  취소
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? '탈퇴 처리 중...' : '탈퇴하기'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
