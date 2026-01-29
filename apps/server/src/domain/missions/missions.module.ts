import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { Mission } from './entities/mission.entity';
import { MissionsController } from './missions.controller';
import { MissionRepository } from './missions.repository';
import { MissionsService } from './missions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mission])],
  controllers: [MissionsController],
  providers: [MissionsService, MissionRepository],
  exports: [MissionsService],
})
export class MissionModule {}
