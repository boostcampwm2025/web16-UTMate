import { nanoid } from 'nanoid';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

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

  @BeforeInsert()
  generatePublicId() {
    if (!this.publicId) {
      this.publicId = nanoid(11);
    }
  }
}
