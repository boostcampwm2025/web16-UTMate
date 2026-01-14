import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ParticipantStatus, UserType } from '../enums';

import { Test } from '#domain/tests/entities/test.entity';
import { User } from '#domain/users/entities/user.entity';

@Entity('participants')
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'public_id', unique: true })
  publicId: string;

  @ManyToOne(() => Test, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'test_id' })
  test: Test;

  @Column({ name: 'test_id' })
  testId: number;

  @Column({ type: 'enum', enum: UserType, name: 'user_type' })
  userType: UserType;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ nullable: true, name: 'user_id' })
  userId?: number;

  @Column({ type: 'enum', enum: ParticipantStatus, default: ParticipantStatus.ONGOING })
  status: ParticipantStatus;

  @Column({ type: 'text', nullable: true })
  feedback?: string;

  @Column({ name: 'joined_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date;

  private constructor() {}

  static create(userId: number | undefined, testId: number): Participant {
    const participant = new Participant();
    participant.testId = testId;

    // 로그인 사용자인지 비회원인지에 따라 userType 설정
    if (userId) {
      participant.userType = UserType.REGISTERED;
      participant.userId = userId;
      return participant;
    }
    participant.userType = UserType.GUEST;
    return participant;
  }

  @BeforeInsert()
  generatePublicId() {
    if (!this.publicId) {
      this.publicId = nanoid();
    }
  }
}
