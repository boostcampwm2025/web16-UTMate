import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { MissionProgressDto, MissionProgressDtoV2 } from './dto/mission-progress.dto';
import { Participant } from './entities/participant.entity';
import { ParticipantStatus } from './enums';
import { ParticipantsRepository } from './participants.repository';

@Injectable()
export class ParticipantsService {
  constructor(@Inject() private readonly participantsRepository: ParticipantsRepository) {}

  async createParticipant(userId: number | undefined, testId: number) {
    const participant = Participant.create(userId, testId);
    const savedParticipant = await this.participantsRepository.save(participant);
    return { participantId: savedParticipant.publicId };
  }

  async findIdByPublicId(publicId: string) {
    const participant = await this.participantsRepository.findByPublicId(publicId);
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }
    return participant.id;
  }

  async getparticipantMissionProgress(publicId: string) {
    const participant =
      await this.participantsRepository.findByPublicIdWithMissionResults(publicId);

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    if (participant.status === ParticipantStatus.COMPLETED) {
      throw new BadRequestException('참가자는 이미 테스트를 완료한 상태입니다.');
    }

    return MissionProgressDto.fromMissionResults(participant.missionResults);
  }

  async getMissionProgress(publicId: string) {
    const participant =
      await this.participantsRepository.findByPublicIdWithMissionResultsAndMission(publicId);
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }
    if (participant.status === ParticipantStatus.COMPLETED) {
      throw new BadRequestException('참가자는 이미 테스트를 완료한 상태입니다.');
    }
    return MissionProgressDtoV2.fromMissionResults(participant.missionResults);
  }
}
