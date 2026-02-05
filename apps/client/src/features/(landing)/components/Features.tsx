import Image from 'next/image';

/**
 * Features Section - 서비스 주요 기능 소개
 */
export function Features() {
  const features = [
    {
      title: '공개 테스트 탐색',
      description: '다양한 공개 테스트를 탐색하고 참여하여 더 많은 사용자 피드백을 받을 수 있습니다.',
      image: '/images/landing/공개테스트탐색.webp',
    },
    {
      title: '간편한 테스트 생성',
      description: '단계별 설정을 통해 사용성 테스트를 간단하게 생성할 수 있습니다.',
      image: '/images/landing/테스트 생성.webp',
    },
    {
      title: '테스트 참여',
      description: '링크 하나로 손쉽게 테스트에 참여하고 사용자 경험을 제공할 수 있습니다.',
      image: '/images/landing/테스트참여.webp',
    },
    {
      title: '세션 리플레이 분석',
      description: '사용자의 실제 행동을 동영상처럼 재생하여 UX 문제를 정확히 파악할 수 있습니다.',
      image: '/images/landing/테스트세션리플레이.webp',
    },
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            왜 UT를 사용해야 할까요?
          </h2>
          <p className="text-lg text-muted-foreground">
            데이터 기반의 의사결정으로 더 나은 사용자 경험을 만드세요
          </p>
        </div>

        {/* 기능 그리드 */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/50"
            >
              {/* 이미지 영역 */}
              <div className="relative h-64 w-full overflow-hidden bg-muted">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  quality={75}
                />
              </div>

              {/* 콘텐츠 영역 */}
              <div className="p-6">
                {/* 제목 */}
                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>

                {/* 설명 */}
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* 호버 효과 */}
              <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* 추가 설명 */}
        <div className="mt-16 rounded-2xl border bg-card/50 p-8 backdrop-blur-sm">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* 이미지 영역 (추후 교체) */}
            <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/5 p-8 lg:p-12">
              <p className="text-center text-sm text-muted-foreground">
                User Testing 설명 이미지
              </p>
            </div>

            {/* 텍스트 */}
            <div className="flex flex-col justify-center">
              <h3 className="mb-4 text-2xl font-bold">User Testing이란?</h3>
              <p className="leading-relaxed text-muted-foreground">
                User Testing(사용성 테스트)은 실제 사용자가 제품이나 서비스를 사용하는 과정을 관찰하고 분석하여,
                사용자 경험(UX)의 문제점을 발견하고 개선점을 찾는 방법입니다.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                단순한 설문조사를 넘어{' '}
                <span className="font-semibold text-foreground">실제 행동 데이터</span>를 수집함으로써
                더 객관적이고 정확한 인사이트를 얻을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
