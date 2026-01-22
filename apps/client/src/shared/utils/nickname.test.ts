import { describe, it, expect } from 'vitest';
import { generateNicknameFromId } from './nickname';

describe('generateNicknameFromId', () => {
  it('여러 번 호출해도 같은 id는 항상 같은 결과를 반환해야 한다', () => {
    const id = 'participant-abc-123';
    const results = Array.from({ length: 100 }, () => generateNicknameFromId(id));

    // 모든 결과가 동일한지 확인
    const firstResult = results[0];
    results.forEach((result) => {
      expect(result).toBe(firstResult);
    });
  });
});
