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
}
