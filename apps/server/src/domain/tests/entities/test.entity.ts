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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

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

  handleStatusChange(status: TestStatus) {
    switch (status) {
      case TestStatus.DRAFT:
        this.draft();
        break;
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

  private draft() {
    this.status = TestStatus.DRAFT;
  }

  private publish() {
    if (this.sdkStatus === false) {
      throw new Error('SDK 연결이 확인되지 않아 테스트를 게시할 수 없습니다.');
    }
    this.status = TestStatus.PUBLISHED;
  }

  private archive() {
    if (this.status === TestStatus.DRAFT) {
      throw new Error('Draft 상태의 테스트는 Archive 할 수 없습니다.');
    }
    this.status = TestStatus.ARCHIVED;
  }

  @BeforeInsert()
  generatePublicId() {
    if (!this.publicId) {
      this.publicId = nanoid();
    }
  }
}
