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
  const [current, setCurrent] = useState(0);

  // 5초마다 자동 슬라이드
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  // 현재 슬라이드 인덱스 추적
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const slides = [
    {
      title: '사용자 행동을 기록하세요',
      description: '실제 사용자가 어떻게 서비스를 이용하는지 세션 리플레이로 확인할 수 있습니다.',
      gradient: 'from-primary/20 to-primary/5',
      // TODO: 이미지 경로 추가
      imagePlaceholder: '🎬',
    },
    {
      title: '데이터로 증명하세요',
      description: '클릭, 스크롤, 체류 시간 등 모든 행동 데이터를 수집하고 분석합니다.',
      gradient: 'from-secondary/20 to-secondary/5',
      // TODO: 이미지 경로 추가
      imagePlaceholder: '📊',
    },
    {
      title: '미션으로 테스트하세요',
      description: '특정 작업을 수행하도록 요청하고 성공률과 완료 시간을 측정합니다.',
      gradient: 'from-primary/20 to-primary/5',
      // TODO: 이미지 경로 추가
      imagePlaceholder: '🎯',
    },
    {
      title: '인사이트를 얻으세요',
      description: '수집된 데이터를 시각화된 대시보드로 확인하고 개선점을 찾아보세요.',
      gradient: 'from-secondary/20 to-secondary/5',
      // TODO: 이미지 경로 추가
      imagePlaceholder: '📈',
    },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 p-8">
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
                className={`flex h-125 flex-col items-center justify-center gap-6 rounded-2xl bg-linear-to-br ${slide.gradient} p-12 text-center`}
              >
                {/* 이미지 영역 (나중에 실제 이미지로 교체) */}
                <div className="mb-4 flex h-48 w-full items-center justify-center rounded-xl bg-white/50 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="mb-2 text-6xl">{slide.imagePlaceholder}</div>
                    <p className="text-xs text-muted-foreground">
                      이미지 영역 (추후 교체)
                    </p>
                  </div>
                </div>

                {/* 타이틀 */}
                <h3 className="text-2xl font-bold text-foreground">{slide.title}</h3>

                {/* 설명 */}
                <p className="text-base leading-relaxed text-muted-foreground">
                  {slide.description}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* 페이지네이션 인디케이터 */}
      <div className="flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === current
                ? 'w-8 bg-primary'
                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  );
}
