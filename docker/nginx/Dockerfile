# --------------------------------------------------------
# SDK 빌드 단계
# --------------------------------------------------------
FROM node:24-alpine AS builder

# pnpm 설치 및 설정
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 빌드 시점 환경변수 선언
ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=${VITE_SERVER_URL}

# 워크스페이스 설정 파일만 먼저 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# SDK 관련 package.json만 복사 (의존성 설치를 위해)
COPY apps/sdk/package.json ./apps/sdk/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/

# SDK와 관련된 의존성만 설치
RUN pnpm install --filter sdk --frozen-lockfile

# SDK 소스 코드만 복사
COPY apps/sdk ./apps/sdk

# SDK 빌드
RUN pnpm --filter sdk build 
# -> 결과물이 /app/apps/sdk/dist 에 생성됨

# --------------------------------------------------------
# Nginx 단계: 정적 파일 서빙 및 리버스 프록시
# --------------------------------------------------------
FROM nginx:alpine

# Builder 단계에서 빌드한 SDK 정적 파일을 Nginx의 html 디렉토리로 복사
COPY --from=builder /app/apps/sdk/dist /usr/share/nginx/html/sdk

# Nginx 설정 파일 복사
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# 80 443 포트 노출
EXPOSE 80
EXPOSE 443

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]