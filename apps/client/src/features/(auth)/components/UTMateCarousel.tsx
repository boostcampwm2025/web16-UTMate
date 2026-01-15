'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/shared/components/ui/carousel';
import { cn } from '@/shared/utils';

/* TODO : 이미지 확정 시 누끼 제대로 따기 & webp로 변환 */
const slides = [
  {
    title: '모험을 떠나세요',
    description: '서비스를 개선하기 위한 첫 걸음을 내딛으세요.',
    image: '/images/astronaut.png',
  },
  {
    title: '마법처럼 시작하세요',
    description: '복잡한 설정 없이 간편하게 시작하세요.',
    image: '/images/wizard.png',
  },
  {
    title: '사용자의 소리를 들으세요',
    description: '사용자의 소리를 들어 서비스의 개선점을 찾아내세요.',
    image: '/images/voice.png',
  },
  {
    title: '데이터로 말하세요',
    description: '로그, 세션 리플레이로 정량적으로 데이터를 분석하세요.',
    image: '/images/developer.png',
  },
];

const CAROUSEL_INTERVAL = 5000;

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
    }, CAROUSEL_INTERVAL);

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

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: 'start',
        loop: true,
      }}
      className="hidden h-full flex-1 bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 lg:flex"
    >
      <CarouselContent className="ml-0 h-full w-full flex-1">
        {slides.map((slide, index) => {
          const isActive = index === current;

          return (
            <CarouselItem key={index} className="relative h-full pl-0">
              {/* 메인 콘텐츠 영역 */}
              <div className="relative flex h-full flex-col items-start justify-center px-12">
                {/* 이미지 - 작은 크기로 중앙 배치 + 등장 애니메이션 */}
                <div
                  className={cn(
                    'relative mx-auto mb-8 transition-all duration-900 ease-out',
                    isActive
                      ? 'translate-y-0 scale-100 opacity-100'
                      : 'translate-y-8 scale-95 opacity-0',
                  )}
                >
                  <div
                    className="relative h-64 w-64 xl:h-80 xl:w-80"
                    style={{
                      animation: isActive ? 'float 3s ease-in-out infinite' : 'none',
                    }}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      sizes="320px"
                      className="object-contain drop-shadow-2xl"
                      priority={index === 0}
                    />
                  </div>
                </div>

                {/* 텍스트 콘텐츠 */}
                <div className="flex flex-col gap-3 text-left">
                  <h3 className="max-w-md text-2xl font-bold tracking-tight break-keep text-gray-700 xl:text-3xl">
                    {slide.title}
                  </h3>
                  <p className="max-w-sm text-base leading-relaxed break-keep text-gray-600">
                    {slide.description}
                  </p>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      {/* 페이지네이션 인디케이터 (하단 중앙) */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'h-2.5 rounded-full transition-all duration-500',
              index === current ? 'bg-primary w-8' : 'w-2.5 bg-gray-300 hover:bg-gray-400',
            )}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </Carousel>
  );
}
