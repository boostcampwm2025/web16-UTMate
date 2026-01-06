import { LoginForm } from '@/features/(auth)/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">로그인</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            계정에 로그인하여 서비스를 이용하세요
          </p>
        </div>

        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <LoginForm />
        </div>

        {/* <div className="text-center text-sm text-muted-foreground">
          <p>
            계정이 없으신가요?{' '}
            <a href="/signup" className="font-medium text-primary hover:underline">
              회원가입
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
}
