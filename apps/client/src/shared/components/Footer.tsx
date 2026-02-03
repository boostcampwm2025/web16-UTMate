import { cn } from '@/shared/utils';

export function Footer({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer
      className={cn(
        'from-primary to-primary/80 text-primary-foreground flex w-full flex-col items-center justify-center gap-4 bg-linear-to-r py-8 md:flex-row md:py-8',
        className,
      )}
      {...props}
    >
      <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        <p className="text-center text-sm leading-loose text-balance md:text-left">
          © {new Date().getFullYear()} UTMate. All rights reserved.
        </p>
        <a
          href="https://www.flaticon.com/free-icons/animals"
          title="animals icons"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-foreground/70 hover:text-primary-foreground text-center text-xs transition-colors md:text-right"
          aria-label="Flaticon에서 Freepik이 제작한 동물 아이콘 출처 보기 (새 탭에서 열림)"
        >
          Animals icons created by Freepik - Flaticon
        </a>
      </div>
    </footer>
  );
}
