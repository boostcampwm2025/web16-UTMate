import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Participant } from '#domain/participants/entities/participant.entity';
import { Mission } from '#domain/tests/entities/mission.entity';

export enum MissionResultStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

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

  static start(missionId: number, participantId: number): MissionResult {
    return new MissionResult(missionId, participantId);
  }

  recordUploadedFile(filename: string) {
    this.filename = filename;
  }

  complete(status: MissionResultStatus, feedback?: string) {
    this.status = status;
    if (feedback) {
      this.feedback = feedback;
    }
  }

  @BeforeInsert()
  generatePublicId() {
    if (!this.publicId) {
      this.publicId = nanoid();
    }
  }
}
