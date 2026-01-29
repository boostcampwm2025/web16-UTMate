import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Persona } from './persona.entity';

import { Test } from '#domain/tests/entities/test.entity';

export enum OAuthProvider {
  github = 'github',
}

@Entity('users')
@Unique(['providerId', 'provider'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'public_id', unique: true, length: 11 })
  publicId: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  avatarUrl: string;

  @Column({ type: 'enum', enum: OAuthProvider })
  provider: OAuthProvider;

  @Column()
  providerId: string;

  @OneToMany(() => Test, (test) => test.owner)
  ownedTests: Test[];

  @ManyToMany(() => Test, (test) => test.members)
  sharedTests: Test[];

  @OneToOne(() => Persona, (persona) => persona.user, { nullable: true })
  persona: Persona;

  @Column({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @BeforeInsert()
  generatePublicId() {
    if (!this.publicId) {
      this.publicId = nanoid(11);
    }
  }
}
