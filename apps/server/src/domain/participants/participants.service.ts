import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { CompleteParticipantDto } from './dto/complete-participant.dto';
import { ParticipantDto } from './dto/participant.dto';
import { Participant } from './entities/participant.entity';
import { ParticipantsRepository } from './participants.repository';

import { MissionResultsService } from '#domain/mission-result/misson-results.service';
import { Mission } from '#domain/tests/entities/mission.entity';

@Injectable()
export class ParticipantsService {
  constructor(
    @Inject() private readonly participantsRepository: ParticipantsRepository,
    @Inject() private readonly missionResultsService: MissionResultsService,
    @Inject() private readonly dataSource: DataSource,
  ) {}

  async createParticipant(userId: number | undefined, testId: number, missions: Mission[]) {
    return await this.dataSource.transaction(async (manager) => {
      // Participant 생성
      const participant = Participant.create(userId, testId);
      const savedParticipant = await this.participantsRepository.save(participant, manager);

      // 각 미션에 대해 MissionResult 생성
      const missionResults = await this.missionResultsService.createMissionResults(
        missions,
        savedParticipant.id,
        manager,
      );

      return ParticipantDto.fromEntity(savedParticipant, missionResults);
    });
  }

  async getParticipantWithMissionResults(publicId: string) {
    const participant = await this.participantsRepository.findByPublicId(publicId);
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    const missionResults = await this.missionResultsService.getMissionResultsByParticipantId(
      participant.id,
    );

    return ParticipantDto.fromEntity(participant, missionResults);
  }

  async completeParticipant(publicId: string, dto: CompleteParticipantDto) {
    const paricipants = await this.participantsRepository.findByPublicId(publicId);
    if (!paricipants) {
      throw new NotFoundException('Participant not found');
    }
    paricipants.complete(dto.status, dto.feedback);
    await this.participantsRepository.save(paricipants);
  }
}
