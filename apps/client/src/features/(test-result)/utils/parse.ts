import type { eventWithTime } from '@rrweb/types';

export const parseJsonlToEvents = (text: string): eventWithTime[] => {
    const lines = text.split('\n').filter((line) => line.trim() !== '');
    const events: eventWithTime[] = [];
  
    for (const line of lines) {
      try {
        const event = JSON.parse(line) as eventWithTime;
        events.push(event);
      } catch (error) {
        console.warn('Failed to parse JSONL line:', line, error);
        // 파싱 실패한 줄은 건너뛰기
      }
    }
  
    return events;
  };