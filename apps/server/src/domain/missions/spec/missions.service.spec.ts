import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { MissionResultsService } from '../../mission-result/misson-results.service';
import { ParticipantsService } from '../../participants/participants.service';
import { UpdateMissionDto } from '../dto/update-mission.dto';
import { Mission } from '../entities/mission.entity';
import { MissionRepository } from '../missions.repository';
import { MissionsService } from '../missions.service';

import { Test as TestEntity } from '#domain/tests/entities/test.entity';
import { User } from '#domain/users/entities/user.entity';

describe('MissionsService', () => {
  let service: MissionsService;
  let missionRepository: MissionRepository;

  const mockMissionRepository = {
    findAllByTestId: jest.fn(),
    saveAll: jest.fn(),
    deleteAll: jest.fn(),
    findByPublicIdWithAllRelations: jest.fn(),
  };

  const mockParticipantsService = {};

  const mockMissionResultsService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissionsService,
        { provide: MissionRepository, useValue: mockMissionRepository },
        { provide: ParticipantsService, useValue: mockParticipantsService },
        { provide: MissionResultsService, useValue: mockMissionResultsService },
      ],
    }).compile();

    service = module.get<MissionsService>(MissionsService);
    missionRepository = module.get<MissionRepository>(MissionRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateMissions', () => {
    it('새로운 미션을 추가해야 한다', async () => {
      const testId = 1;
      const updateDto = new UpdateMissionDto();
      updateDto.order = 1;
      updateDto.name = '새 미션';
      updateDto.description = '설명';
      updateDto.url = 'https://example.com';

      mockMissionRepository.findAllByTestId.mockResolvedValue([]);
      mockMissionRepository.saveAll.mockResolvedValue(undefined);

      await service.updateMissions(testId, [updateDto]);

      expect(missionRepository.findAllByTestId).toHaveBeenCalledWith(testId, undefined);
      expect(missionRepository.saveAll).toHaveBeenCalled();
    });

    it('기존 미션을 업데이트해야 한다', async () => {
      const testId = 1;
      const existingMission = new Mission();
      existingMission.publicId = 'mission-123';
      existingMission.order = 1;
      existingMission.name = '기존 미션';
      existingMission.update = jest.fn();

      const updateDto = new UpdateMissionDto();
      updateDto.publicId = 'mission-123';
      updateDto.order = 2;
      updateDto.name = '업데이트된 미션';
      updateDto.description = '새 설명';
      updateDto.url = 'https://updated.com';

      mockMissionRepository.findAllByTestId.mockResolvedValue([existingMission]);
      mockMissionRepository.saveAll.mockResolvedValue(undefined);

      await service.updateMissions(testId, [updateDto]);

      expect(existingMission.update).toHaveBeenCalledWith(
        2,
        '업데이트된 미션',
        '새 설명',
        'https://updated.com',
      );
      expect(missionRepository.saveAll).toHaveBeenCalled();
    });

    it('참조되지 않는 미션을 삭제해야 한다', async () => {
      const testId = 1;
      const existingMission = new Mission();
      existingMission.publicId = 'mission-old';

      const updateDto = new UpdateMissionDto();
      updateDto.order = 1;
      updateDto.name = '새 미션';
      updateDto.description = '설명';
      updateDto.url = 'https://example.com';

      mockMissionRepository.findAllByTestId.mockResolvedValue([existingMission]);
      mockMissionRepository.saveAll.mockResolvedValue(undefined);
      mockMissionRepository.deleteAll.mockResolvedValue(undefined);

      await service.updateMissions(testId, [updateDto]);

      expect(missionRepository.deleteAll).toHaveBeenCalled();
    });

    it('트랜잭션 매니저를 사용하여 미션을 업데이트해야 한다', async () => {
      const testId = 1;
      const manager = {} as EntityManager;

      const updateDto = new UpdateMissionDto();
      updateDto.order = 1;
      updateDto.name = '새 미션';
      updateDto.description = '설명';
      updateDto.url = 'https://example.com';

      mockMissionRepository.findAllByTestId.mockResolvedValue([]);
      mockMissionRepository.saveAll.mockResolvedValue(undefined);

      await service.updateMissions(testId, [updateDto], manager);

      expect(missionRepository.findAllByTestId).toHaveBeenCalledWith(testId, manager);
      expect(missionRepository.saveAll).toHaveBeenCalledWith(expect.anything(), manager);
    });
  });

  describe('getMissionResultById', () => {
    it('미션 상세 결과를 조회해야 한다', async () => {
      const owner = new User();
      owner.id = 1;

      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.ownerId = 1;
      mockTest.members = [];

      const mission = new Mission();
      mission.publicId = 'mission-123';
      mission.test = mockTest;
      mission.missionResults = [];

      mockMissionRepository.findByPublicIdWithAllRelations.mockResolvedValue(mission);

      const result = await service.getMissionResultById(1, 'mission-123');

      expect(missionRepository.findByPublicIdWithAllRelations).toHaveBeenCalledWith('mission-123');
      expect(result).toBeDefined();
    });

    it('멤버도 미션 상세 결과를 조회할 수 있어야 한다', async () => {
      const member = new User();
      member.id = 2;

      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.ownerId = 1;
      mockTest.members = [member];

      const mission = new Mission();
      mission.publicId = 'mission-123';
      mission.test = mockTest;
      mission.missionResults = [];

      mockMissionRepository.findByPublicIdWithAllRelations.mockResolvedValue(mission);

      const result = await service.getMissionResultById(2, 'mission-123');

      expect(missionRepository.findByPublicIdWithAllRelations).toHaveBeenCalledWith('mission-123');
      expect(result).toBeDefined();
    });

    it('미션을 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockMissionRepository.findByPublicIdWithAllRelations.mockResolvedValue(null);

      await expect(service.getMissionResultById(1, 'invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getMissionResultById(1, 'invalid-id')).rejects.toThrow(
        'Mission not found',
      );
    });

    it('소유자가 아니고 멤버도 아니면 NotFoundException을 던져야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.ownerId = 1;
      mockTest.members = [];

      const mission = new Mission();
      mission.publicId = 'mission-123';
      mission.test = mockTest;
      mission.missionResults = [];

      mockMissionRepository.findByPublicIdWithAllRelations.mockResolvedValue(mission);

      await expect(service.getMissionResultById(999, 'mission-123')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getMissionResultById(999, 'mission-123')).rejects.toThrow(
        'Mission not found',
      );
    });
  });
});
