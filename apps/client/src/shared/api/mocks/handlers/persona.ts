import { http, HttpResponse } from 'msw';

import { CLIENT_BASE_URL } from '@/shared/constants/api';
import { Interest } from '@/features/(auth)/types/persona';
import type { PersonaData } from '@/features/(auth)/types/persona';

export const personaHandlers = [
  http.get(`${CLIENT_BASE_URL}/users/persona`, () => {
    const mockPersona: PersonaData = {
      gender: '남성',
      ageGroup: '20대',
      interests: [Interest.IT, Interest.GAMING, Interest.SELF_IMPROVEMENT],
      description: '안녕하세요! 개발과 게임을 좋아하는 20대 남성입니다.',
    };

    return HttpResponse.json(mockPersona);
  }),
];
