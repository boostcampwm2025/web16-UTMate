import type { NextConfig } from 'next';
import { loadEnvConfig } from '@next/env';
import path from 'path';

// 모노레포 루트의 .env를 빌드 타임에 로드
// CI에서 루트에 .env를 생성하면 apps/client/.env 없이도 NEXT_PUBLIC_* 변수가 주입됨
loadEnvConfig(path.resolve(__dirname, '../..'));

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
