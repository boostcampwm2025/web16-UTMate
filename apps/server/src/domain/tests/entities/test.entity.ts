import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Mission } from './mission.entity';

import { Participant } from '#domain/participants/entities/participant.entity';
import { User } from '#domain/users/entities/user.entity';

export enum TestStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

@Entity('tests')
export class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 21 })
  publicId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TestStatus, default: TestStatus.DRAFT })
  status: TestStatus;

  @Column({ nullable: true })
  url: string;

  @Column({ default: false })
  sdkStatus: boolean;

  @OneToMany(() => Mission, (mission) => mission.test)
  missions: Mission[];

  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Participant, (participant) => participant.test)
  participants: Participant[];

  totalParticipants: number;

  private constructor() {}

  static createTest(title: string, ownerId: number): Test {
    const test = new Test();
    test.title = title;
    test.ownerId = ownerId;
    return test;
  }

  update(title: string, description: string, url: string) {
    this.title = title;
    this.description = description;
    this.url = url;
  }

  transitionStatus(status: TestStatus) {
    switch (status) {
      case TestStatus.DRAFT:
        throw new Error('Draft 상태로 변경할 수 없습니다.');
      case TestStatus.PUBLISHED:
        this.publish();
        break;
      case TestStatus.ARCHIVED:
        this.archive();
        break;
      default:
        throw new Error('Invalid status');
    }
  }

  private publish() {
    if (this.sdkStatus === false) {
      throw new Error('SDK 연결이 확인되지 않아 테스트를 게시할 수 없습니다.');
    }
    if (!this.missions || this.missions.length === 0) {
      throw new Error('미션이 확인되지 않아 테스트를 게시할 수 없습니다.');
    }

    if (!this.startDate) {
      this.startDate = new Date();
    }
    this.endDate = undefined;
    this.status = TestStatus.PUBLISHED;
  }

  private archive() {
    if (this.status === TestStatus.DRAFT) {
      throw new Error('Draft 상태의 테스트는 Archive 할 수 없습니다.');
    }
    this.endDate = new Date();
    this.status = TestStatus.ARCHIVED;
  }

  @BeforeInsert()
  generatePublicId() {
    if (!this.publicId) {
      this.publicId = nanoid();
    }
  }
}
