import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

export enum Interest {
  EDUCATION = '교육',
  LANGUAGES = '외국어',
  SELF_IMPROVEMENT = '자기계발',
  SCIENCE = '과학',
  READING = '독서',
  IT = 'IT',
  GAMING = '게임',
  PRODUCTIVITY = '생산성',
  BUSINESS = '비즈니스',
  AI = 'AI',
  MEDIA = '미디어',
  MOVIES = '영화',
  ANIMATION = '애니메이션',
  FASHION = '패션',
  BEAUTY = '뷰티',
  SHOPPING = '쇼핑',
  FINANCE = '금융',
  REAL_ESTATE = '부동산',
  STOCKS = '주식',
  MUSIC = '음악',
  INSTRUMENTS = '악기',
  TRAVEL = '여행',
  PHOTOGRAPHY = '사진',
  OUTDOORS = '아웃도어',
  SPORTS = '스포츠',
  HEALTH = '건강',
  FITNESS = '운동',
  COMMUNITY = '커뮤니티',
  SOCIAL = '소셜',
  PETS = '반려동물',
  PARENTING = '육아',
  INTERIOR = '인테리어',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum AgeGroup {
  TEN = '10',
  TWENTY = '20',
  THIRTY = '30',
  FORTY = '40',
  FIFTY = '50',
  SIXTY_PLUS = '60+',
}

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

  @Column({ name: 'age_group', type: 'varchar', length: 10 })
  ageGroup: AgeGroup;

  @Column({ type: 'json' })
  interests: Interest[];

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
