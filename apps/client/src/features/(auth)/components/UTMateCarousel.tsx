'use client';

import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/shared/components/ui/carousel';

/**
 * UTMate 소개 Carousel
 * 5초마다 자동으로 슬라이드 변경
 */
export function UTMateCarousel() {
  const [api, setApi] = useState<CarouselApi>();

  // 5초마다 자동 슬라이드
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  const slides = [
    {
      icon: '🎬',
      title: '사용자 행동을 기록하세요',
      description: '실제 사용자가 어떻게 서비스를 이용하는지 세션 리플레이로 확인할 수 있습니다.',
      gradient: 'from-primary/20 to-primary/5',
    },
    {
      icon: '📊',
      title: '데이터로 증명하세요',
      description: '클릭, 스크롤, 체류 시간 등 모든 행동 데이터를 수집하고 분석합니다.',
      gradient: 'from-secondary/20 to-secondary/5',
    },
    {
      icon: '🎯',
      title: '미션으로 테스트하세요',
      description: '특정 작업을 수행하도록 요청하고 성공률과 완료 시간을 측정합니다.',
      gradient: 'from-primary/20 to-primary/5',
    },
    {
      icon: '📈',
      title: '인사이트를 얻으세요',
      description: '수집된 데이터를 시각화된 대시보드로 확인하고 개선점을 찾아보세요.',
      gradient: 'from-secondary/20 to-secondary/5',
    },
  ];

  return (
    <div className="flex h-full items-center justify-center p-8">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full max-w-lg"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div
                className={`relative flex h-[500px] flex-col items-center justify-center rounded-2xl bg-linear-to-br ${slide.gradient} p-12 text-center`}
              >
                {/* 아이콘 */}
                <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/80 text-6xl shadow-lg backdrop-blur-sm">
                  {slide.icon}
                </div>

                {/* 타이틀 */}
                <h3 className="mb-4 text-3xl font-bold text-foreground">
                  {slide.title}
                </h3>

                {/* 설명 */}
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {slide.description}
                </p>

                {/* 인디케이터 */}
                <div className="absolute bottom-8 flex gap-2">
                  {slides.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all ${
                        i === index
                          ? 'w-8 bg-primary'
                          : 'w-2 bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
