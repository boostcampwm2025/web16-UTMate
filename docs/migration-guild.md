# 마이그레이션 가이드

## 마이그레이션

- 평소에는 Sync를 통해서 개발하며 배포 직전에 Migration을 만드는 전략을 선택

## 마이그레이션 루틴

### 로컬 DB 초기화

- 개발 동안 생성된 DB를 제거합니다.

```
  pnpm run schema:drop
```

### 배포 단계 DB로 마이그레이션

- 배포 단계 DB로 마이그레이션 합니다.

```
  pnpm run migration:run
```

### 마이그레이션 생성

- 이번 배포 단계의 마이그레이션을 만듭니다.

```
  pnpm run migration:generate src/migrations/Release_vx.x.x
```

### 마이그레이션 테스트

- 마이그레이션한 DB로 문제가 없는지 테스트를 진행합니다.

```
  pnpm run migration:run
```
