import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Persona } from './entities/persona.entity';
import { User } from './entities/user.entity';
import { PersonaRepository } from './persona.repository';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Persona])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PersonaRepository],
  exports: [UsersService],
})
export class UsersModule {}
