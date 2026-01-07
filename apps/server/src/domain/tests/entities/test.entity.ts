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

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TestStatus, default: TestStatus.DRAFT })
  status: TestStatus;

  @Column()
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

  static createTest(title: string, owner: User): Test {
    const test = new Test();
    test.title = title;
    test.owner = owner;
    return test;
  }

  @BeforeInsert()
  generatePublicId() {
    if (!this.publicId) {
      this.publicId = nanoid();
    }
  }
}
