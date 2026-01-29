'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Separator } from '@/shared/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { getCurrentUser, deleteUser, savePersona, getPersona } from '@/features/(auth)/apis/client';
import type { User, PersonaData, Interest } from '@/features/(auth)/types';
import { INTEREST_OPTIONS, GENDER_OPTIONS, AGE_GROUP_OPTIONS } from '@/features/(auth)/constants/interests';

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
  const [persona, setPersona] = useState<PersonaData>({
    gender: 'MALE',
    ageGroup: '20',
    interests: [],
    description: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userData, personaData] = await Promise.all([
          getCurrentUser(),
          getPersona(),
        ]);
        setUser(userData);
        if (personaData) {
          setPersona(personaData);
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
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

  const handleSavePersona = async () => {
    if (persona.interests.length === 0) {
      alert('최소 1개 이상의 관심사를 선택해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      await savePersona(persona);
      alert('페르소나가 저장되었습니다.');
    } catch (error) {
      console.error('페르소나 저장 실패:', error);
      alert('페르소나 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleInterest = (interest: Interest) => {
    setPersona((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
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

  const userInitials = user.username
    .split(' ')
    .map((n) => n[0])
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
              <AvatarImage src={user.avatarUrl} alt={user.username} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">{user.username}</h3>
              {user.email && (
                <p className="text-muted-foreground text-sm">{user.email}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">사용자 이름</Label>
              <Input id="username" value={user.username} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                value={user.email || '이메일 정보가 없습니다'}
                disabled
                className={!user.email ? 'text-muted-foreground' : ''}
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
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* 성별 */}
            <div className="grid gap-2">
              <Label htmlFor="gender">성별</Label>
              <Select
                value={persona.gender}
                onValueChange={(value) => setPersona({ ...persona, gender: value as 'MALE' | 'FEMALE' })}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="성별을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 연령대 */}
            <div className="grid gap-2">
              <Label htmlFor="ageGroup">연령대</Label>
              <Select
                value={persona.ageGroup}
                onValueChange={(value) => setPersona({ ...persona, ageGroup: value as any })}
              >
                <SelectTrigger id="ageGroup">
                  <SelectValue placeholder="연령대를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {AGE_GROUP_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 관심사 */}
          <div className="grid gap-3">
            <Label>관심사 (복수 선택 가능)</Label>
            <div className="flex flex-wrap gap-2 rounded-lg border p-4">
              {INTEREST_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => toggleInterest(option.key)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    persona.interests.includes(option.key)
                      ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="text-muted-foreground text-xs">
              최소 1개 이상 선택해주세요. 선택한 관심사: {persona.interests.length}개
            </p>
          </div>

          <Separator />

          {/* 추가 설명 */}
          <div className="grid gap-2">
            <Label htmlFor="description">추가 설명 (선택사항)</Label>
            <Textarea
              id="description"
              placeholder="예: 모바일 앱 사용 빈도가 높으며, 새로운 서비스를 자주 시도하는 편입니다..."
              value={persona.description}
              onChange={(e) => setPersona({ ...persona, description: e.target.value })}
              rows={4}
              className="resize-none"
            />
            <p className="text-muted-foreground text-xs">
              테스트 참여 시 참고할 수 있는 추가적인 사용자 특성을 입력하세요.
            </p>
          </div>

          <Button onClick={handleSavePersona} disabled={isSaving}>
            {isSaving ? '저장 중...' : '페르소나 저장'}
          </Button>
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
                  <p className="text-destructive mt-4 font-semibold">
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
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
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
