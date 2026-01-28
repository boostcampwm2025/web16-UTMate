import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Persona } from './entities/persona.entity';
import { UpdatePersonaDto } from './dto/persona.dto';

@Injectable()
export class PersonaRepository {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) {}

  async findByUserId(userId: number): Promise<Persona | null> {
    return this.personaRepository.findOne({ where: { userId } });
  }

  async save(persona: Persona): Promise<Persona> {
    return this.personaRepository.save(persona);
  }

  async update(userId: number, dto: UpdatePersonaDto): Promise<void> {
    await this.personaRepository.update({ userId }, dto);
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.personaRepository.delete({ userId });
  }
}
