import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdatePersonaDto } from './dto/persona.dto';
import { Persona } from './entities/persona.entity';

@Injectable()
export class PersonaRepository {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) {}

  async findByUserId(userId: number) {
    return this.personaRepository.findOne({ where: { userId } });
  }

  async save(persona: Persona) {
    return this.personaRepository.save(persona);
  }

  async update(userId: number, dto: UpdatePersonaDto) {
    await this.personaRepository.update({ userId }, dto);
  }

  async deleteByUserId(userId: number) {
    await this.personaRepository.delete({ userId });
  }
}
