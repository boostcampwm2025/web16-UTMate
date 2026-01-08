FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 빌드 시점 환경변수 선언
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SDK_URL

# 필수 메타 파일만 먼저 복사해 의존성 캐시 활용
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/client/package.json ./apps/client/

# 클라이언트 의존성 설치 (workspace 필터)
RUN pnpm install --filter client --frozen-lockfile

# 소스 복사 후 빌드
COPY apps/client ./apps/client
COPY packages ./packages
COPY apps/client/tsconfig.json ./apps/client/tsconfig.json
RUN pnpm --filter client build

# --- 런타임 이미지 ---
FROM node:24-alpine AS runner
WORKDIR /app

# Next.js standalone 출력 복사 (워크스페이스 구조 유지)
COPY --from=builder /app/apps/client/.next/standalone ./
COPY --from=builder /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=builder /app/apps/client/public ./apps/client/public

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Next standalone entry (워크스페이스 경로)
CMD ["node", "apps/client/server.js"]
