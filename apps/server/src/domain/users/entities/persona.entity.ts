import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

import { AgeRange, Gender, Interest } from '#common/enums';

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', unique: true })
  userId: number;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ name: 'age_group', type: 'enum', enum: AgeRange })
  ageGroup: AgeRange;

  @Column({ type: 'json' })
  interests: Interest[];

  @Column({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
