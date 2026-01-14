import { nanoid } from 'nanoid';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum MissionResultStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

@Entity('mission_results')
export class MissionResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'public_id', length: 21 })
  publicId: string;

  @Column({ name: 'participant_id' })
  participantId: string;

  @Column({ name: 'mission_id' })
  missionId: string;

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

  private constructor(participantId: string, missionId: string) {
    this.participantId = participantId;
    this.missionId = missionId;
    this.status = MissionResultStatus.PENDING;
    this.duration = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static start(participantId: string, missionId: string): MissionResult {
    return new MissionResult(participantId, missionId);
  }

  complete(feedback?: string) {
    this.status = MissionResultStatus.COMPLETED;
    this.duration = Date.now() - this.createdAt.getTime();
    this.feedback = feedback;
    this.updatedAt = new Date();
  }

  fail(feedback?: string) {
    this.status = MissionResultStatus.FAILED;
    this.duration = Date.now() - this.createdAt.getTime();
    this.feedback = feedback;
    this.updatedAt = new Date();
  }

  skip() {
    this.status = MissionResultStatus.SKIPPED;
    this.duration = Date.now() - this.createdAt.getTime();
    this.updatedAt = new Date();
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
