import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { TestStatus } from './entities/test.entity';
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
    const tests = await this.testsService.getMyTests(payload.userId);
    return tests;
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getTestById(@JwtPayload() payload: JwtPayloadDto, @Param('id') publicId: string) {
    return this.testsService.getTestById(payload.userId, publicId);
  }

  @Get('/:id/sdkStatus')
  @UseGuards(JwtAuthGuard)
  async getSdkStatus(@JwtPayload() payload: JwtPayloadDto, @Param('id') publicId: string) {
    return this.testsService.getSdkStatus(payload.userId, publicId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTest(@JwtPayload() payload: JwtPayloadDto, @Body() body: CreateTestDto) {
    const testId = await this.testsService.createTest(payload.userId, body.title);
    return { testId };
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async updateTest(
    @JwtPayload() payload: JwtPayloadDto,
    @Param('id') publicId: string,
    @Body() updateTestDto: UpdateTestDto,
  ) {
    return await this.testsService.updateTest(payload.userId, publicId, updateTestDto);
  }

  @Post('/:id/verify-sdk')
  @UseGuards(JwtAuthGuard)
  async verifySdk(@JwtPayload() payload: JwtPayloadDto, @Param('id') publicId: string) {
    // SDK 검증 로직은 서비스 레이어에서 구현
    return this.testsService.verifySdkInstallation(payload.userId, publicId);
  }

  @Post('/:id/status')
  @UseGuards(JwtAuthGuard)
  async updateTestStatus(
    @JwtPayload() payload: JwtPayloadDto,
    @Param('id') publicId: string,
    @Body('status', new ParseEnumPipe(TestStatus)) status: TestStatus,
  ) {
    return await this.testsService.updateTestStatus(payload.userId, publicId, status);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteTest(@JwtPayload() payload: JwtPayloadDto, @Param('id') publicId: string) {
    return await this.testsService.deleteTest(payload.userId, publicId);
  }
}
