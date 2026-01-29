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

import { MissionResult } from '#domain/mission-result/entities/mission-result.entity';
import { Test } from '#domain/tests/entities/test.entity';

@Entity('missions')
export class Mission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'public_id', unique: true, length: 11 })
  publicId: string;

  @ManyToOne(() => Test, (test) => test.missions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'test_id' })
  test: Test;

  @Column({ name: 'test_id' })
  testId: number;

  @Column()
  order: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  missionUrl: string;

  @Column()
  estimatedDuration: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => MissionResult, (missionResult) => missionResult.mission)
  missionResults: MissionResult[];

  constructor() {}

  update(order: number, name: string, description: string, url: string) {
    this.order = order;
    this.name = name;
    this.description = description;
    this.missionUrl = url;
  }

  @BeforeInsert()
  generatePublicId() {
    if (!this.publicId) {
      this.publicId = nanoid(11);
    }
  }
}
