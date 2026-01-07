import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { UpdateMissionDto } from './dto/update-mission.dto';
import { Mission } from './entities/mission.entity';
import { Test } from './entities/test.entity';
import { MissionRepository } from './missions.repository';

@Injectable()
export class MissionsService {
  constructor(@Inject() private readonly missionRepository: MissionRepository) {}

  async updateMissions(test: Test, updateMissionDtos: UpdateMissionDto[], manager?: EntityManager) {
    const missions = await this.missionRepository.findAllByTest(test, manager);

    const saveMissions = updateMissionDtos
      .filter((dto) => !dto.publicId)
      .map((dto) => dto.toUserEntity(test));

    const deleteMissions: Mission[] = [];

    missions.forEach((mission) => {
      const dto = updateMissionDtos.find((d) => d.publicId === mission.publicId);
      if (dto) {
        mission.update(dto.order, dto.name, dto.description, dto.url);
        saveMissions.push(mission);
        return;
      }
      deleteMissions.push(mission);
    });

    // 추가된 미션 및 업데이트 된 미션 저장
    // 각 항목마다 TypeORM이 개별 쿼리를 날리기 때문에 성능 이슈가 있을 수 있으나 미션의 개수가 많지 않음으로 최적화 보류
    if (saveMissions.length > 0) await this.missionRepository.saveAll(saveMissions, manager);
    // 참조되지 않는 미션 삭제
    if (deleteMissions.length > 0) await this.missionRepository.deleteAll(deleteMissions, manager);
  }
}
