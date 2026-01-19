import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MissionResultStatus } from '../enums';

import { Participant } from '#domain/participants/entities/participant.entity';
import { Mission } from '#domain/tests/entities/mission.entity';

@Entity('mission_results')
export class MissionResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'public_id', length: 21 })
  publicId: string;

  @ManyToOne(() => Mission, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mission_id' })
  mission: Mission;

  @Column({ name: 'mission_id' })
  missionId: number;

  @ManyToOne(() => Participant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'participant_id' })
  participant: Participant;

  @Column({ name: 'participant_id' })
  participantId: number;

  @Column({ type: 'enum', enum: MissionResultStatus, default: MissionResultStatus.PENDING })
  status: MissionResultStatus;

  @Column({ type: 'int', nullable: true })
  duration?: number;

  @Column({ type: 'text', nullable: true })
  feedback?: string;

  @Column({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // TODO 추가적으로 로그 분석하여 저장할 필드 정의
  @Column({ nullable: true })
  filename?: string;

  private constructor(missionId: number, participantId: number) {
    this.missionId = missionId;
    this.participantId = participantId;
    this.status = MissionResultStatus.PENDING;
    this.duration = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static create(missionId: number, participantId: number): MissionResult {
    return new MissionResult(missionId, participantId);
  }

  transition(status: MissionResultStatus, feedback: string | undefined) {
    switch (status) {
      case MissionResultStatus.IN_PROGRESS:
        this.start();
        break;
      case MissionResultStatus.SUCCESS:
      case MissionResultStatus.FAILED:
        this.complete(status, feedback);
        break;
      default:
        throw new Error('유효하지 않은 미션 결과 상태입니다.');
    }
  }

  private start() {
    if (this.status !== MissionResultStatus.PENDING) {
      throw new Error('미션 결과는 대기 상태에서만 시작할 수 있습니다.');
    }
    this.status = MissionResultStatus.IN_PROGRESS;
  }

  private complete(status: MissionResultStatus, feedback?: string) {
    if (this.status !== MissionResultStatus.IN_PROGRESS) {
      throw new Error('미션 결과는 진행 중 상태에서만 완료할 수 있습니다.');
    }
    if (!this.filename) {
      throw new Error('녹화 파일이 존재하지 않습니다. 녹화 완료를 먼저 진행해주세요.');
    }
    this.status = status;
    this.feedback = feedback;
  }

  recordUploadedFile(filename: string) {
    this.filename = filename;
  }

  @BeforeInsert()
  generatePublicId() {
    if (!this.publicId) {
      this.publicId = nanoid();
    }
  }
}
