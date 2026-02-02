import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Persona } from './entities/persona.entity';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { PersonaRepository } from './persona.repository';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Persona])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PersonaRepository],
  exports: [UsersService],
})
export class UsersModule {}
