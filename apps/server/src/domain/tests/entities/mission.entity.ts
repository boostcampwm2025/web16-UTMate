import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Test } from './test.entity';

import { MissionResult } from '#domain/mission-result/entities/mission-result.entity';

@Entity('missions')
export class Mission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'public_id', unique: true, length: 11 })
  publicId: string;

  @ManyToOne(() => Test, (test) => test.missions, { onDelete: 'CASCADE' })
  test: Test;

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

  private constructor() {}

  static createMission(
    order: number,
    name: string,
    description: string,
    url: string,
    estimatedDuration: number,
    test: Test,
  ): Mission {
    const mission = new Mission();
    mission.order = order;
    mission.name = name;
    mission.description = description;
    mission.missionUrl = url;
    mission.estimatedDuration = estimatedDuration;
    mission.test = test;
    return mission;
  }

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
