import { Body, Controller, Inject, Post, Put, UseGuards } from '@nestjs/common';

import { CreateTestDto } from './dto/create-test.dto';
import { TestsService } from './tests.service';

import { JwtPayload } from '#domain/auth/decorator/param.decorator';
import { JwtPayloadDto } from '#domain/auth/dto/jwt-payload.dto';
import { JwtAuthGuard } from '#domain/auth/guards/jwt-auth.guard';

@Controller('tests')
export class TestsController {
  constructor(@Inject() private readonly testsService: TestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTest(@JwtPayload() payload: JwtPayloadDto, @Body() body: CreateTestDto) {
    const testId = await this.testsService.createTest(payload.userId, body.title);
    return { testId };
  }

  @Put('/:id')
  updateTest() {
    return { message: 'Test updated' };
  }
}
