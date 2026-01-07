import { Body, Controller, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';

import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { TestsService } from './tests.service';

import { JwtPayload } from '#domain/auth/decorator/param.decorator';
import { JwtPayloadDto } from '#domain/auth/dto/jwt-payload.dto';
import { JwtAuthGuard } from '#domain/auth/guards/jwt-auth.guard';

@Controller('tests')
export class TestsController {
  constructor(@Inject() private readonly testsService: TestsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTests(@JwtPayload() payload: JwtPayloadDto) {
    return this.testsService.getMyTests(payload.userId);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getTestById(@JwtPayload() payload: JwtPayloadDto, @Param('id') publicId: string) {
    return this.testsService.getTestById(payload.userId, publicId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTest(@JwtPayload() payload: JwtPayloadDto, @Body() body: CreateTestDto) {
    const testId = await this.testsService.createTest(payload.userId, body.title);
    return { testId };
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  updateTest(
    @JwtPayload() payload: JwtPayloadDto,
    @Param('id') publicId: string,
    @Body() updateTestDto: UpdateTestDto,
  ) {
    this.testsService.updateTest(payload.userId, publicId, updateTestDto);
  }
}
