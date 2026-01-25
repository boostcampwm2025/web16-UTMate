import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DataSource } from 'typeorm';

import { ParticipantsRepository } from './participants.repository';

import { MissionResultsService } from '#domain/mission-result/misson-results.service';

@Processor('participant-queue')
export class ParticipantsProcessor extends WorkerHost {
  constructor(
    private readonly participantsRepository: ParticipantsRepository,
    private readonly dataSource: DataSource,
    private readonly missionResultsService: MissionResultsService,
  ) {
    super();
  }

  async process(job: Job) {
    const { participantId } = job.data;
    const participant = await this.participantsRepository.findById(participantId);
    if (!participant) {
      return;
    }
    this.dataSource.transaction(async (manager) => {
      // 참가자 상태를 DROP으로 변경
      participant.markAsDropped();
      await this.participantsRepository.save(participant, manager);

      // 연관된 MissionResult들도 모두 DROP으로 변경
      await this.missionResultsService.dropMissionResultsByParticipantId(participant.id, manager);
    });
  }
}
