import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';
import { EntityManager } from 'typeorm';

import { UpdateMissionResultDto } from '../dto/update-mission-result.dto';
import { MissionResult } from '../entities/mission-result.entity';
import { MissionResultStatus } from '../enums';
import { MissionResultsRepository } from '../mission-results.repository';
import { MissionResultsService } from '../misson-results.service';

import { SDK_AUTH_REDIS } from '#common/redis/redis.module';
import { S3StorageService } from '#common/storage/s3-storage.service';
import { StorageService } from '#common/storage/storage.service';
import { AnalyzerService } from '#domain/analyzer/analyzer.service';
import { Mission } from '#domain/missions/entities/mission.entity';
import { Participant } from '#domain/participants/entities/participant.entity';
import { Test as TestEntity } from '#domain/tests/entities/test.entity';
import { User } from '#domain/users/entities/user.entity';

describe('MissionResultsService', () => {
  let service: MissionResultsService;
  let missionResultsRepository: MissionResultsRepository;
  let s3StorageService: S3StorageService;
  let sdkAuthRedis: Redis;

  const mockMissionResultsRepository = {
    saveAll: jest.fn(),
    findByParticipantIdWithMissions: jest.fn(),
    findByPublicId: jest.fn(),
    save: jest.fn(),
    findByPublicIdWithAllRelations: jest.fn(),
    findByParticipantId: jest.fn(),
  };

  const mockStorageService = {
    getBufferByFilename: jest.fn(),
    deleteByFilename: jest.fn(),
  };

  const mockS3StorageService = {
    uploadToS3: jest.fn(),
    deleteFromS3: jest.fn(),
    getPresignedUrl: jest.fn(),
  };

  const mockAnalyzerService = {
    analyze: jest.fn(),
  };

  const mockSdkAuthRedis = {
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissionResultsService,
        { provide: MissionResultsRepository, useValue: mockMissionResultsRepository },
        { provide: StorageService, useValue: mockStorageService },
        { provide: S3StorageService, useValue: mockS3StorageService },
        { provide: AnalyzerService, useValue: mockAnalyzerService },
        { provide: SDK_AUTH_REDIS, useValue: mockSdkAuthRedis },
      ],
    }).compile();

    service = module.get<MissionResultsService>(MissionResultsService);
    missionResultsRepository = module.get<MissionResultsRepository>(MissionResultsRepository);
    s3StorageService = module.get<S3StorageService>(S3StorageService);
    sdkAuthRedis = module.get<Redis>(SDK_AUTH_REDIS);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMissionResults', () => {
    it('미션 배열을 기반으로 미션 결과를 생성해야 한다', async () => {
      const mission1 = new Mission();
      mission1.id = 1;
      mission1.name = 'Mission 1';
      mission1.publicId = 'mission-1';

      const mission2 = new Mission();
      mission2.id = 2;
      mission2.name = 'Mission 2';
      mission2.publicId = 'mission-2';

      const missions = [mission1, mission2];
      const participantId = 1;
      const missionResults = [
        Object.assign(MissionResult.create(1, 1), { mission: missions[0] }),
        Object.assign(MissionResult.create(2, 1), { mission: missions[1] }),
      ];

      mockMissionResultsRepository.saveAll.mockResolvedValue(undefined);
      mockMissionResultsRepository.findByParticipantIdWithMissions.mockResolvedValue(
        missionResults,
      );

      const result = await service.createMissionResults(missions, participantId);

      expect(missionResultsRepository.saveAll).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ missionId: 1, participantId: 1 }),
          expect.objectContaining({ missionId: 2, participantId: 1 }),
        ]),
        undefined,
      );
      expect(result).toBeDefined();
    });

    it('트랜잭션 매니저가 전달될 경우 이를 사용해야 한다', async () => {
      const mission = new Mission();
      mission.id = 1;
      mission.name = 'Mission 1';
      mission.publicId = 'mission-1';

      const missions = [mission];

      const participantId = 1;
      const manager = {} as EntityManager;

      mockMissionResultsRepository.saveAll.mockResolvedValue(undefined);
      mockMissionResultsRepository.findByParticipantIdWithMissions.mockResolvedValue([]);

      await service.createMissionResults(missions, participantId, manager);

      expect(missionResultsRepository.saveAll).toHaveBeenCalledWith(expect.anything(), manager);
      expect(missionResultsRepository.findByParticipantIdWithMissions).toHaveBeenCalledWith(
        participantId,
        manager,
      );
    });
  });

  describe('getMissionResultsByParticipantId', () => {
    it('참가자 ID로 미션 결과를 조회해야 한다', async () => {
      const participantId = 1;
      const missionResults = [
        Object.assign(MissionResult.create(1, 1), {
          mission: { publicId: 'mission-1' },
        }),
        Object.assign(MissionResult.create(2, 1), {
          mission: { publicId: 'mission-2' },
        }),
      ];

      mockMissionResultsRepository.findByParticipantIdWithMissions.mockResolvedValue(
        missionResults,
      );

      const result = await service.getMissionResultsByParticipantId(participantId);

      expect(missionResultsRepository.findByParticipantIdWithMissions).toHaveBeenCalledWith(
        participantId,
        undefined,
      );
      expect(result).toBeDefined();
    });

    it('트랜잭션 매니저와 함께 조회해야 한다', async () => {
      const participantId = 1;
      const manager = {} as EntityManager;

      mockMissionResultsRepository.findByParticipantIdWithMissions.mockResolvedValue([]);

      await service.getMissionResultsByParticipantId(participantId, manager);

      expect(missionResultsRepository.findByParticipantIdWithMissions).toHaveBeenCalledWith(
        participantId,
        manager,
      );
    });
  });

  describe('createMissionResultRecord', () => {
    it('미션 결과를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      const publicId = 'invalid-id';

      mockMissionResultsRepository.findByPublicId.mockResolvedValue(null);

      await expect(service.createMissionResultRecord(publicId)).rejects.toThrow(NotFoundException);
      await expect(service.createMissionResultRecord(publicId)).rejects.toThrow(
        '미션 결과를 찾을 수 없습니다.',
      );
    });

    it('저장소에서 파일을 찾을 수 없으면 NotFoundException을 전파해야 한다', async () => {
      const publicId = 'mr-123';
      const missionResult = MissionResult.create(1, 1);
      missionResult.publicId = publicId;

      mockMissionResultsRepository.findByPublicId.mockResolvedValue(missionResult);
      mockStorageService.getBufferByFilename.mockRejectedValue(new NotFoundException());

      await expect(service.createMissionResultRecord(publicId)).rejects.toThrow(NotFoundException);
    });

    it('S3 업로드 실패 시 InternalServerErrorException을 던지고 파일을 삭제해야 한다', async () => {
      const publicId = 'mr-123';
      const missionResult = MissionResult.create(1, 1);
      missionResult.publicId = publicId;

      const logBuffer = Buffer.from('test log');

      mockMissionResultsRepository.findByPublicId.mockResolvedValue(missionResult);
      mockStorageService.getBufferByFilename.mockResolvedValue(logBuffer);
      mockS3StorageService.uploadToS3.mockRejectedValue(new Error('Upload failed'));
      mockS3StorageService.deleteFromS3.mockResolvedValue(undefined);

      await expect(service.createMissionResultRecord(publicId)).rejects.toThrow(
        '로그 파일 업로드에 실패했습니다.',
      );
      expect(s3StorageService.deleteFromS3).toHaveBeenCalledWith(
        `replay_logs/${publicId}.log.jsonl`,
      );
    });
  });

  describe('updateMissionResult', () => {
    it('미션 결과를 IN_PROGRESS 상태로 업데이트해야 한다', async () => {
      const publicId = 'mr-123';
      const missionResult = MissionResult.create(1, 1);
      missionResult.publicId = publicId;

      mockMissionResultsRepository.findByPublicId.mockResolvedValue(missionResult);
      mockMissionResultsRepository.save.mockResolvedValue(undefined);
      mockSdkAuthRedis.set.mockResolvedValue('OK');

      await service.updateMissionResult(publicId, { status: MissionResultStatus.IN_PROGRESS });

      expect(missionResultsRepository.findByPublicId).toHaveBeenCalledWith(publicId);
      expect(sdkAuthRedis.set).toHaveBeenCalledWith(publicId, 'in_progress');
      expect(missionResultsRepository.save).toHaveBeenCalled();
    });

    it('미션 결과를 SUCCESS 상태로 업데이트해야 한다', async () => {
      const publicId = 'mr-123';
      const missionResult = MissionResult.create(1, 1);
      missionResult.publicId = publicId;
      missionResult.filename = 'test.jsonl';
      missionResult.status = MissionResultStatus.IN_PROGRESS;

      mockMissionResultsRepository.findByPublicId.mockResolvedValue(missionResult);
      mockMissionResultsRepository.save.mockResolvedValue(undefined);

      await service.updateMissionResult(publicId, {
        status: MissionResultStatus.SUCCESS,
        feedback: '좋은 결과입니다',
      });

      expect(missionResultsRepository.save).toHaveBeenCalled();
    });

    it('미션 결과를 FAILED 상태로 업데이트해야 한다', async () => {
      const publicId = 'mr-123';
      const missionResult = MissionResult.create(1, 1);
      missionResult.publicId = publicId;
      missionResult.filename = 'test.jsonl';
      missionResult.status = MissionResultStatus.IN_PROGRESS;

      mockMissionResultsRepository.findByPublicId.mockResolvedValue(missionResult);
      mockMissionResultsRepository.save.mockResolvedValue(undefined);

      await service.updateMissionResult(publicId, {
        status: MissionResultStatus.FAILED,
        feedback: '실패했습니다',
      });

      expect(missionResultsRepository.save).toHaveBeenCalled();
    });

    it('미션 결과를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      const publicId = 'invalid-id';

      mockMissionResultsRepository.findByPublicId.mockResolvedValue(null);

      await expect(
        service.updateMissionResult(publicId, { status: MissionResultStatus.IN_PROGRESS }),
      ).rejects.toThrow(NotFoundException);
    });

    it('유효하지 않은 상태로 업데이트하려면 BadRequestException을 던져야 한다', async () => {
      const publicId = 'mr-123';
      const missionResult = MissionResult.create(1, 1);
      missionResult.publicId = publicId;

      mockMissionResultsRepository.findByPublicId.mockResolvedValue(missionResult);

      const dto = new UpdateMissionResultDto();
      dto.status = 'WRONG_STATUS' as MissionResultStatus;

      await expect(service.updateMissionResult(publicId, dto)).rejects.toThrow(BadRequestException);
      await expect(service.updateMissionResult(publicId, dto)).rejects.toThrow(
        '유효하지 않은 미션 결과 상태입니다.',
      );
    });
  });

  describe('getMissionResultsDetail', () => {
    it('미션 결과 상세 정보를 조회해야 한다', async () => {
      const userId = 1;
      const publicId = 'mr-123';
      const test = TestEntity.createTest('Test', userId);
      test.members = [];

      const uaInfo = { ua: 'Mozilla/5.0' } as UAParser.IResult;

      const participant = Participant.create(userId, test.id, uaInfo);
      const missionResult = MissionResult.create(1, 1);
      missionResult.publicId = publicId;
      missionResult.participant = participant;
      missionResult.participant.test = test;
      missionResult.status = MissionResultStatus.SUCCESS;
      missionResult.filename = 'replay_logs/mr-123.log.jsonl';
      missionResult.mission = new Mission();
      missionResult.mission.publicId = 'mission-1';

      mockMissionResultsRepository.findByPublicIdWithAllRelations.mockResolvedValue(missionResult);
      mockS3StorageService.getPresignedUrl.mockResolvedValue(
        'https://s3.example.com/presigned-url',
      );

      const result = await service.getMissionResultsDetail(userId, publicId);

      expect(missionResultsRepository.findByPublicIdWithAllRelations).toHaveBeenCalledWith(
        publicId,
      );
      expect(s3StorageService.getPresignedUrl).toHaveBeenCalledWith(missionResult.filename);
      expect(result).toBeDefined();
    });

    it('미션 결과를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      const userId = 1;
      const publicId = 'invalid-id';

      mockMissionResultsRepository.findByPublicIdWithAllRelations.mockResolvedValue(null);

      await expect(service.getMissionResultsDetail(userId, publicId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('소유자가 아니면 NotFoundException을 던져야 한다', async () => {
      const userId = 999;
      const publicId = 'mr-123';
      const test = TestEntity.createTest('Test', 1);
      test.members = [];

      const uaInfo = { ua: 'Mozilla/5.0' } as UAParser.IResult;
      const participant = Participant.create(1, test.id, uaInfo);
      const missionResult = MissionResult.create(1, 1);
      missionResult.publicId = publicId;
      missionResult.participant = participant;
      missionResult.participant.test = test;
      missionResult.status = MissionResultStatus.SUCCESS;

      mockMissionResultsRepository.findByPublicIdWithAllRelations.mockResolvedValue(missionResult);

      await expect(service.getMissionResultsDetail(userId, publicId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('멤버인 경우 접근 가능해야 한다', async () => {
      const userId = 2;
      const publicId = 'mr-123';
      const test = TestEntity.createTest('Test', 1);
      const memberUser = new User();
      memberUser.id = userId;
      test.members = [memberUser];

      const uaInfo = { ua: 'Mozilla/5.0' } as UAParser.IResult;
      const participant = Participant.create(1, test.id, uaInfo);
      const missionResult = MissionResult.create(1, 1);
      missionResult.publicId = publicId;
      missionResult.participant = participant;
      missionResult.participant.test = test;
      missionResult.status = MissionResultStatus.SUCCESS;
      missionResult.filename = 'replay_logs/mr-123.log.jsonl';
      missionResult.mission = new Mission();
      missionResult.mission.publicId = 'mission-1';

      mockMissionResultsRepository.findByPublicIdWithAllRelations.mockResolvedValue(missionResult);
      mockS3StorageService.getPresignedUrl.mockResolvedValue(
        'https://s3.example.com/presigned-url',
      );

      const result = await service.getMissionResultsDetail(userId, publicId);

      expect(result).toBeDefined();
    });

    it('아직 완료되지 않은 미션 결과(PENDING)면 ForbiddenException을 던져야 한다', async () => {
      const userId = 1;
      const publicId = 'mr-123';
      const test = TestEntity.createTest('Test', userId);
      test.members = [];

      const uaInfo = { ua: 'Mozilla/5.0' } as UAParser.IResult;
      const participant = Participant.create(userId, test.id, uaInfo);
      const missionResult = MissionResult.create(1, 1);
      missionResult.publicId = publicId;
      missionResult.participant = participant;
      missionResult.participant.test = test;
      missionResult.status = MissionResultStatus.PENDING;

      mockMissionResultsRepository.findByPublicIdWithAllRelations.mockResolvedValue(missionResult);

      await expect(service.getMissionResultsDetail(userId, publicId)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.getMissionResultsDetail(userId, publicId)).rejects.toThrow(
        '아직 완료되지 않은 미션 결과입니다.',
      );
    });

    it('아직 완료되지 않은 미션 결과(IN_PROGRESS)면 ForbiddenException을 던져야 한다', async () => {
      const userId = 1;
      const publicId = 'mr-123';
      const test = TestEntity.createTest('Test', userId);
      test.members = [];

      const uaInfo = { ua: 'Mozilla/5.0' } as UAParser.IResult;
      const participant = Participant.create(userId, test.id, uaInfo);
      const missionResult = MissionResult.create(1, 1);
      missionResult.publicId = publicId;
      missionResult.participant = participant;
      missionResult.participant.test = test;
      missionResult.status = MissionResultStatus.IN_PROGRESS;

      mockMissionResultsRepository.findByPublicIdWithAllRelations.mockResolvedValue(missionResult);

      await expect(service.getMissionResultsDetail(userId, publicId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('dropMissionResultsByParticipantId', () => {
    it('참가자의 진행 중인 미션 결과를 DROP 처리해야 한다', async () => {
      const participantId = 1;
      const manager = {} as EntityManager;
      const missionResults = [
        MissionResult.create(1, 1),
        MissionResult.create(2, 1),
        MissionResult.create(3, 1),
      ];

      mockMissionResultsRepository.findByParticipantId.mockResolvedValue(missionResults);
      mockMissionResultsRepository.saveAll.mockResolvedValue(undefined);

      await service.dropMissionResultsByParticipantId(participantId, manager);

      expect(missionResultsRepository.findByParticipantId).toHaveBeenCalledWith(
        participantId,
        manager,
      );
      expect(missionResultsRepository.saveAll).toHaveBeenCalled();
    });

    it('완료된 미션 결과는 DROP 처리하지 않아야 한다', async () => {
      const participantId = 1;
      const manager = {} as EntityManager;
      const successResult = MissionResult.create(1, 1);
      successResult.status = MissionResultStatus.SUCCESS;
      const failedResult = MissionResult.create(2, 1);
      failedResult.status = MissionResultStatus.FAILED;

      mockMissionResultsRepository.findByParticipantId.mockResolvedValue([
        successResult,
        failedResult,
      ]);
      mockMissionResultsRepository.saveAll.mockResolvedValue(undefined);

      await service.dropMissionResultsByParticipantId(participantId, manager);

      expect(missionResultsRepository.saveAll).toHaveBeenCalled();
    });

    it('DROP 처리 시 레포지토리에 저장해야 한다', async () => {
      const participantId = 1;
      const manager = {} as EntityManager;
      const pendingResult = MissionResult.create(1, 1);
      pendingResult.status = MissionResultStatus.PENDING;

      mockMissionResultsRepository.findByParticipantId.mockResolvedValue([pendingResult]);
      mockMissionResultsRepository.saveAll.mockResolvedValue(undefined);

      await service.dropMissionResultsByParticipantId(participantId, manager);

      expect(missionResultsRepository.saveAll).toHaveBeenCalledWith(
        expect.arrayContaining([expect.anything()]),
        manager,
      );
    });
  });
});
