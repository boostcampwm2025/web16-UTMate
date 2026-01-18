'use client';

import { useEffect, useState } from 'react';
import { Particles } from '@/features/(pre-register)/components/Particles';
import { Button } from '@/shared/components/ui/button';
import { Star } from 'lucide-react';

const PRE_REGISTER_FORM_URL = 'https://forms.gle/5FFxGsMpy7uPu1Rf8';

export default function PreRegisterPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePreRegisterClick = () => {
    window.open(PRE_REGISTER_FORM_URL, '_blank');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* 배경 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 그라데이션 배경*/}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0a28] to-[#0d2847]" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#8884fd]/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-[#8884fd]/10 to-transparent" />

        {/* 파티클 배경 */}
        <Particles
          particleColors={['#ffffff', '#88ccff', '#aaddff']}
          particleCount={400}
          particleSpread={15}
          speed={0.1}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={true}
          className="opacity-80"
        />

        {/* 하단 프라이머리 색상 원형 (지구 느낌) */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-[90%] md:translate-y-[95%]">
          {/* 글로우 효과 */}
          <div className="bg-primary/15 absolute -inset-40 rounded-full blur-[120px]" />
          <div className="bg-primary/25 absolute -inset-20 rounded-full blur-3xl" />

          {/* 메인 원형 - 뷰포트 기준 크기 */}
          <div className="from-primary/50 via-primary to-primary/95 relative h-[280vw] min-h-[2200px] w-[280vw] min-w-[2200px] overflow-hidden rounded-full bg-gradient-to-b">
            {/* 상단 빛나는 효과 (대기권) */}
            <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-white/35 via-white/15 to-transparent" />
            {/* 대기권 테두리 */}
            <div className="absolute -inset-1 rounded-full border-t-[10px] border-white/25 blur-[3px]" />
          </div>
        </div>
      </div>

      {/* 오른쪽 상단 GitHub 스타 버튼 */}
      <a
        href="https://github.com/boostcampwm2025/web16-UTMate"
        target="_blank"
        rel="noopener noreferrer"
        className={`group absolute top-4 right-4 z-30 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-all hover:bg-white/20 md:top-8 md:right-8 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}
        style={{ transitionDuration: '1000ms', transitionDelay: '500ms' }}
        title="Star on GitHub"
      >
        <Star className="h-4 w-4 transition-all duration-300 group-hover:fill-white" />
      </a>

      {/* 콘텐츠 */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4">
        {/* 메인 텍스트 */}
        <div
          className={`mb-12 text-center transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="mb-4 text-7xl font-bold tracking-wider text-white">
            <span className="from-primary to-primary/70 bg-linear-to-r bg-clip-text text-transparent">
              UTMate
            </span>
          </h1>
          <p className="text-2xl text-white/80 md:text-4xl">
            세상에서 가장 쉬운 사용성 테스트가 온다
          </p>
        </div>

        {/* 사전예약 버튼 */}
        <div
          className={`flex flex-col items-center transition-all delay-300 duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <Button
            size="lg"
            className="group bg-primary shadow-primary/30 hover:shadow-primary/40 relative overflow-hidden rounded-full px-12 py-7 text-xl font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            onClick={handlePreRegisterClick}
          >
            <span className="relative z-10">사전예약하기</span>
            <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform group-hover:translate-x-full" />
          </Button>
          <p className="mt-4 text-sm text-white/60">오픈베타 출시 알림 메일을 보내드려요</p>
          <p className="text-sm text-white/60">사전예약 시 서비스 펑생 무로 및 특전 제공</p>
        </div>
      </div>
    </div>
  );
}
