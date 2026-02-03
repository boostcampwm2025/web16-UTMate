import { getQueueToken } from '@nestjs/bullmq';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { PARTICIPANT_QUEUE } from '../const';
import { Participant } from '../entities/participant.entity';
import { ParticipantStatus } from '../enums';
import { ParticipantsRepository } from '../participants.repository';
import { ParticipantsService } from '../participants.service';

import { MissionResultsService } from '#domain/mission-result/misson-results.service';
import { Mission } from '#domain/missions/entities/mission.entity';

describe('ParticipantsService', () => {
  let service: ParticipantsService;
  let participantsRepository: ParticipantsRepository;
  let missionResultsService: MissionResultsService;

  const mockParticipantsRepository = {
    save: jest.fn(),
    findByPublicId: jest.fn(),
  };

  const mockMissionResultsService = {
    createMissionResults: jest.fn(),
    getMissionResultsByParticipantId: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  const mockParticipantQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipantsService,
        { provide: ParticipantsRepository, useValue: mockParticipantsRepository },
        { provide: MissionResultsService, useValue: mockMissionResultsService },
        { provide: DataSource, useValue: mockDataSource },
        { provide: getQueueToken(PARTICIPANT_QUEUE), useValue: mockParticipantQueue },
      ],
    }).compile();

    service = module.get<ParticipantsService>(ParticipantsService);
    participantsRepository = module.get<ParticipantsRepository>(ParticipantsRepository);
    missionResultsService = module.get<MissionResultsService>(MissionResultsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createParticipant', () => {
    it('로그인 사용자 참가자를 생성해야 한다', async () => {
      const userId = 1;
      const testId = 1;
      const missions: Mission[] = [];
      const uaInfo = {
        ua: 'Mozilla/5.0',
        browser: { name: 'Chrome', version: '90.0.0' },
      } as UAParser.IResult;

      const savedParticipant = Participant.create(userId, testId, uaInfo);
      savedParticipant.id = 1;
      savedParticipant.publicId = 'participant-123';

      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback({});
      });

      mockParticipantsRepository.save.mockResolvedValue(savedParticipant);
      mockMissionResultsService.createMissionResults.mockResolvedValue([]);
      mockParticipantQueue.add.mockResolvedValue(undefined);

      const result = await service.createParticipant(userId, testId, missions, uaInfo);

      expect(participantsRepository.save).toHaveBeenCalled();
      expect(missionResultsService.createMissionResults).toHaveBeenCalledWith(missions, 1, {});
      expect(mockParticipantQueue.add).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('비회원 참가자를 생성해야 한다', async () => {
      const userId = undefined;
      const testId = 1;
      const missions: Mission[] = [];
      const uaInfo = {
        ua: 'Mozilla/5.0',
        browser: { name: 'Chrome', version: '90.0.0' },
      } as UAParser.IResult;

      const savedParticipant = Participant.create(userId, testId, uaInfo);
      savedParticipant.id = 2;
      savedParticipant.publicId = 'participant-456';

      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback({});
      });

      mockParticipantsRepository.save.mockResolvedValue(savedParticipant);
      mockMissionResultsService.createMissionResults.mockResolvedValue([]);
      mockParticipantQueue.add.mockResolvedValue(undefined);

      const result = await service.createParticipant(userId, testId, missions, uaInfo);

      expect(participantsRepository.save).toHaveBeenCalled();
      expect(missionResultsService.createMissionResults).toHaveBeenCalledWith(missions, 2, {});
      expect(result).toBeDefined();
    });
  });

  describe('getParticipantWithMissionResults', () => {
    it('참가자와 미션 결과를 조회해야 한다', async () => {
      const uaInfo = {
        ua: 'Mozilla/5.0',
        browser: { name: 'Chrome', version: '90.0.0' },
      } as UAParser.IResult;
      const participant = Participant.create(1, 1, uaInfo);
      participant.id = 1;
      participant.publicId = 'participant-123';
      participant.missionResults = [];

      mockParticipantsRepository.findByPublicId.mockResolvedValue(participant);
      mockMissionResultsService.getMissionResultsByParticipantId.mockResolvedValue([]);

      const result = await service.getParticipantWithMissionResults('participant-123');

      expect(participantsRepository.findByPublicId).toHaveBeenCalledWith('participant-123');
      expect(missionResultsService.getMissionResultsByParticipantId).toHaveBeenCalledWith(1);
      expect(result).toBeDefined();
    });

    it('참가자를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockParticipantsRepository.findByPublicId.mockResolvedValue(null);

      await expect(service.getParticipantWithMissionResults('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getParticipantWithMissionResults('invalid-id')).rejects.toThrow(
        'Participant not found',
      );
    });
  });

  describe('completeParticipant', () => {
    it('참가자를 완료 상태로 업데이트해야 한다', async () => {
      const uaInfo = { ua: 'Mozilla/5.0' } as UAParser.IResult;
      const participant = Participant.create(1, 1, uaInfo);
      participant.publicId = 'participant-123';
      participant.status = ParticipantStatus.IN_PROGRESS;
      participant.complete = jest.fn();

      mockParticipantsRepository.findByPublicId.mockResolvedValue(participant);
      mockParticipantsRepository.save.mockResolvedValue(undefined);

      const completeDto = {
        status: ParticipantStatus.COMPLETED,
        feedback: '좋은 테스트였습니다',
      };

      await service.completeParticipant('participant-123', completeDto);

      expect(participantsRepository.findByPublicId).toHaveBeenCalledWith('participant-123');
      expect(participant.complete).toHaveBeenCalledWith(
        ParticipantStatus.COMPLETED,
        '좋은 테스트였습니다',
      );
      expect(participantsRepository.save).toHaveBeenCalledWith(participant);
    });

    it('피드백 없이 참가자를 완료 상태로 업데이트할 수 있어야 한다', async () => {
      const uaInfo = { ua: 'Mozilla/5.0' } as UAParser.IResult;
      const participant = Participant.create(1, 1, uaInfo);
      participant.publicId = 'participant-123';
      participant.status = ParticipantStatus.IN_PROGRESS;
      participant.complete = jest.fn();

      mockParticipantsRepository.findByPublicId.mockResolvedValue(participant);
      mockParticipantsRepository.save.mockResolvedValue(undefined);

      const completeDto = {
        status: ParticipantStatus.COMPLETED,
        feedback: undefined,
      };

      await service.completeParticipant('participant-123', completeDto);

      expect(participant.complete).toHaveBeenCalledWith(ParticipantStatus.COMPLETED, undefined);
      expect(participantsRepository.save).toHaveBeenCalled();
    });

    it('참가자를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockParticipantsRepository.findByPublicId.mockResolvedValue(null);

      const completeDto = {
        status: ParticipantStatus.COMPLETED,
        feedback: '피드백',
      };

      await expect(service.completeParticipant('invalid-id', completeDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.completeParticipant('invalid-id', completeDto)).rejects.toThrow(
        'Participant not found',
      );
    });

    it('잘못된 상태로 변경하려면 BadRequestException을 던져야 한다', async () => {
      const uaInfo = { ua: 'Mozilla/5.0' } as UAParser.IResult;
      const participant = Participant.create(1, 1, uaInfo);
      participant.publicId = 'participant-123';
      participant.status = ParticipantStatus.IN_PROGRESS;
      participant.complete = jest.fn(() => {
        throw new Error('참가자 상태는 COMPLETED로만 변경할 수 있습니다.');
      });

      mockParticipantsRepository.findByPublicId.mockResolvedValue(participant);

      const completeDto = {
        status: ParticipantStatus.DROP,
        feedback: '피드백',
      };

      await expect(service.completeParticipant('participant-123', completeDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
