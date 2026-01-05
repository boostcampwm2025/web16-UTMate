import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export enum OAuthProvider {
  github = 'github',
}

@Entity('user')
@Unique(['providerId', 'provider'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
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
}
