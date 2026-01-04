# GitHub Secrets 설정 가이드

## 필수 GitHub Secrets

GitHub Repository → Settings → Secrets and variables → Actions → New repository secret

### 1. SSH 관련

```
SERVER_HOST=your.server.ip.address
SERVER_USER=ubuntu (또는 root)
SERVER_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

### 2. Database 관련

```
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=utmate
DATABASE_PASSWORD=your-secure-db-password
DATABASE_NAME=utmate
```

### 3. JWT

```
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
```

### 4. Docker Compose (선택 - 자동 전송용)

docker-compose.yml 파일 내용 전체를 복사해서:

```
DOCKER_COMPOSE_CONTENT=<docker-compose.yml 전체 내용>
```

---

## GitHub Variables 설정

Repository → Settings → Secrets and variables → Actions → Variables 탭

### Public 환경 변수 (클라이언트 빌드용)

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SDK_URL=https://cdn.yourdomain.com/sdk
```

---

## SSH Key 생성 방법

서버에서 실행:

```bash
# 1. SSH 키 생성
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions

# 2. Public key를 authorized_keys에 추가
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys

# 3. Private key 내용 복사 (이걸 SERVER_SSH_KEY에 등록)
cat ~/.ssh/github-actions
```

---

## 전체 Secrets 요약

**총 10개 필요:**

**SSH (3개)**

- SERVER_HOST
- SERVER_USER
- SERVER_SSH_KEY

**Database (5개)**

- DATABASE_HOST
- DATABASE_PORT
- DATABASE_USER
- DATABASE_PASSWORD
- DATABASE_NAME

**JWT (1개)**

- JWT_SECRET

**Optional (1개)**

- DOCKER_COMPOSE_CONTENT

**Variables (2개)**

- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_SDK_URL
