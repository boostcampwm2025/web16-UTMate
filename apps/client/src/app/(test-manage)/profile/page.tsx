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

interface PersonaData {
  ageGroup: string;
  gender: string;
  occupation: string;
  jobLevel: string;
  techLevel: string;
  description: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [persona, setPersona] = useState<PersonaData>({
    ageGroup: '',
    gender: '',
    occupation: '',
    jobLevel: '',
    techLevel: '',
    description: '',
  });
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
              <p className="text-muted-foreground text-sm">User ID: {user.publicId}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">사용자 이름</Label>
              <Input id="username" value={user.username} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="publicId">Public ID</Label>
              <Input id="publicId" value={user.publicId} disabled />
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
            {/* 연령대 */}
            <div className="grid gap-2">
              <Label htmlFor="ageGroup">연령대</Label>
              <Select
                value={persona.ageGroup}
                onValueChange={(value) => setPersona({ ...persona, ageGroup: value })}
              >
                <SelectTrigger id="ageGroup">
                  <SelectValue placeholder="연령대를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10s">10대</SelectItem>
                  <SelectItem value="20s">20대</SelectItem>
                  <SelectItem value="30s">30대</SelectItem>
                  <SelectItem value="40s">40대</SelectItem>
                  <SelectItem value="50s">50대</SelectItem>
                  <SelectItem value="60s">60대 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 성별 */}
            <div className="grid gap-2">
              <Label htmlFor="gender">성별</Label>
              <Select
                value={persona.gender}
                onValueChange={(value) => setPersona({ ...persona, gender: value })}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="성별을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 직종 */}
            <div className="grid gap-2">
              <Label htmlFor="occupation">직종</Label>
              <Select
                value={persona.occupation}
                onValueChange={(value) => setPersona({ ...persona, occupation: value })}
              >
                <SelectTrigger id="occupation">
                  <SelectValue placeholder="직종을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">학생</SelectItem>
                  <SelectItem value="it">IT/소프트웨어 개발</SelectItem>
                  <SelectItem value="design">디자인/기획</SelectItem>
                  <SelectItem value="marketing">마케팅/홍보</SelectItem>
                  <SelectItem value="sales">영업/세일즈</SelectItem>
                  <SelectItem value="education">교육</SelectItem>
                  <SelectItem value="healthcare">의료/헬스케어</SelectItem>
                  <SelectItem value="finance">금융/회계</SelectItem>
                  <SelectItem value="service">서비스업</SelectItem>
                  <SelectItem value="manufacturing">제조/생산</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 직급 */}
            <div className="grid gap-2">
              <Label htmlFor="jobLevel">직급/경력</Label>
              <Select
                value={persona.jobLevel}
                onValueChange={(value) => setPersona({ ...persona, jobLevel: value })}
              >
                <SelectTrigger id="jobLevel">
                  <SelectValue placeholder="직급/경력을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intern">인턴</SelectItem>
                  <SelectItem value="junior">신입 (1-3년)</SelectItem>
                  <SelectItem value="mid">중급 (4-7년)</SelectItem>
                  <SelectItem value="senior">고급 (8-12년)</SelectItem>
                  <SelectItem value="expert">전문가 (13년 이상)</SelectItem>
                  <SelectItem value="manager">관리자</SelectItem>
                  <SelectItem value="executive">임원</SelectItem>
                  <SelectItem value="na">해당 없음</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 기술 이해도 */}
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="techLevel">기술 이해도</Label>
              <Select
                value={persona.techLevel}
                onValueChange={(value) => setPersona({ ...persona, techLevel: value })}
              >
                <SelectTrigger id="techLevel">
                  <SelectValue placeholder="기술 이해도를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">초급 - 기본적인 컴퓨터 사용만 가능</SelectItem>
                  <SelectItem value="intermediate">중급 - 일반적인 소프트웨어 활용 가능</SelectItem>
                  <SelectItem value="advanced">고급 - 신기술에 관심이 많고 빠르게 습득</SelectItem>
                  <SelectItem value="expert">전문가 - 기술 분야 전문 지식 보유</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
