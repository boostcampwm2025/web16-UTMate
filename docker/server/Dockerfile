FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 메타 파일만 먼저 복사해 캐시 활용
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/

# 서버 의존성 설치 (빌드용)
RUN pnpm install --filter server --frozen-lockfile

# 소스 복사 후 빌드
COPY apps/server ./apps/server
COPY tsconfig.json ./
COPY apps/server/tsconfig.json ./apps/server/tsconfig.json
RUN pnpm --filter server build

# --- 런타임 이미지 ---
FROM node:24-alpine AS runner
WORKDIR /app

# 프로덕션 의존성만 설치
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
RUN pnpm install --filter server --prod --frozen-lockfile

# 실행 디렉터리를 앱 루트로 이동
WORKDIR /app/apps/server

# 빌드 산출물 복사
COPY --from=builder /app/apps/server/dist ./

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "main.js"]
