import Image from 'next/image';

/**
 * Features Section - 서비스 주요 기능 소개
 */
export function Features() {
  const features = [
    {
      title: '공개 테스트 탐색',
      description:
        '다양한 공개 테스트를 탐색하고 참여하여 더 많은 사용자 피드백을 받을 수 있습니다.',
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
      description:
        '사용자의 실제 행동을 동영상처럼 재생하여 UX 문제를 정확히 파악할 수 있고,\n이상현상을 쉽게 식별할 수 있습니다.',
      image: '/images/landing/테스트세션리플레이.webp',
    },
    {
      title: '미션별 상세 분석',
      description:
        '각 미션별 성공률, 소요 시간, 사용자 피드백을 한눈에 확인하고 분석할 수 있습니다.',
      image: '/images/landing/미션별상세.png',
    },
  ];

  return (
    <section id="features" className="bg-background py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            왜 UT를 사용해야 할까요?
          </h2>
          <p className="text-muted-foreground text-lg">
            데이터 기반의 의사결정으로 더 나은 사용자 경험을 만드세요
          </p>
        </div>

        {/* 기능 그리드 */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group bg-card hover:border-primary/50 relative overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md ${
                index === features.length - 1 ? 'sm:col-span-2' : ''
              }`}
            >
              {/* 이미지 영역 */}
              <div className="bg-muted relative h-96 w-full overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  quality={75}
                  unoptimized={feature.image.endsWith('.webp')}
                />
              </div>

              {/* 콘텐츠 영역 */}
              <div className="p-6">
                {/* 제목 */}
                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>

                {/* 설명 */}
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {feature.description}
                </p>
              </div>

              {/* 호버 효과 */}
              <div className="from-primary/5 absolute inset-0 -z-10 bg-linear-to-br to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* 추가 설명 */}
        <div className="bg-card/50 mt-16 rounded-2xl border p-8 backdrop-blur-sm">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* 이미지 영역 */}
            <div className="bg-muted relative h-80 overflow-hidden rounded-xl">
              <Image
                src="/images/landing/UserTesting이미지.png"
                alt="User Testing - 사용자가 테스트를 진행하는 모습"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
                quality={85}
              />
            </div>

            {/* 텍스트 */}
            <div className="flex flex-col justify-center">
              <h3 className="mb-4 text-2xl font-bold">User Testing이란?</h3>
              <p className="text-muted-foreground leading-relaxed">
                User Testing(사용성 테스트)은 실제 사용자가 제품이나 서비스를 사용하는 과정을
                관찰하고 분석하여, 사용자 경험(UX)의 문제점을 발견하고 개선점을 찾는 방법입니다.
              </p>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                단순한 설문조사를 넘어{' '}
                <span className="text-foreground font-semibold">실제 행동 데이터</span>를
                수집함으로써 더 객관적이고 정확한 인사이트를 얻을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
