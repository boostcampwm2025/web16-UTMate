import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Test } from './test.entity';

@Entity('missions')
export class Mission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 21 })
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

  // TODO : 완료 기준 필드 추가 필요

  @Column()
  estimatedDuration: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  private constructor() {}

  static createMission(
    order: number,
    name: string,
    description: string,
    url: string,
    test: Test,
  ): Mission {
    const mission = new Mission();
    mission.order = order;
    mission.name = name;
    mission.description = description;
    mission.missionUrl = url;
    mission.test = test;
    return mission;
  }

  update(order: number, name: string, description: string, url: string) {
    this.order = order;
    this.name = name;
    this.description = description;
    this.missionUrl = url;
  }
}
