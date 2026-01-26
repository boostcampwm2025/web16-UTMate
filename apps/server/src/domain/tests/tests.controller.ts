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
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UAParser } from 'ua-parser-js';

import { CreateTestDto } from './dto/create-test.dto';
import { AddMemberDto } from './dto/member.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { TestStatus } from './entities/test.entity';
import { DeviceInfo } from './interface';
import { TestsService } from './tests.service';

import { UserId } from '#domain/auth/decorator/param.decorator';
import { JwtAuthGuard } from '#domain/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '#domain/auth/guards/optional-jwt-auth.guard';

@Controller('tests')
export class TestsController {
  constructor(@Inject() private readonly testsService: TestsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTests(@UserId() userId: number) {
    const tests = await this.testsService.getMyTests(userId);
    return tests;
  }

  @Get('/:id')
  @UseGuards(OptionalJwtAuthGuard)
  async getTestById(@UserId() userId: number | undefined, @Param('id') publicId: string) {
    return this.testsService.getTestById(userId, publicId);
  }

  @Get('/:id/sdkStatus')
  @UseGuards(JwtAuthGuard)
  async getSdkStatus(@UserId() userId: number, @Param('id') publicId: string) {
    return this.testsService.getSdkStatus(userId, publicId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTest(@UserId() userId: number, @Body() body: CreateTestDto) {
    const testId = await this.testsService.createTest(userId, body.title);
    return { testId };
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async updateTest(
    @UserId() userId: number,
    @Param('id') publicId: string,
    @Body() updateTestDto: UpdateTestDto,
  ) {
    return await this.testsService.updateTest(userId, publicId, updateTestDto);
  }

  @Post('/:id/verify-sdk')
  @UseGuards(JwtAuthGuard)
  async verifySdk(@UserId() userId: number, @Param('id') publicId: string) {
    // SDK 검증 로직은 서비스 레이어에서 구현
    return this.testsService.verifySdkInstallation(userId, publicId);
  }

  @Post('/:id/status')
  @UseGuards(JwtAuthGuard)
  async updateTestStatus(
    @UserId() userId: number,
    @Param('id') publicId: string,
    @Body('status', new ParseEnumPipe(TestStatus)) status: TestStatus,
  ) {
    return await this.testsService.updateTestStatus(userId, publicId, status);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteTest(@UserId() userId: number, @Param('id') publicId: string) {
    return await this.testsService.deleteTest(userId, publicId);
  }

  @Post('/:id/participants')
  @UseGuards(OptionalJwtAuthGuard)
  async participateTest(
    @UserId() userId: number | undefined,
    @Param('id') publicId: string,
    @Req() req: Request,
  ) {
    const uaString = req.headers['user-agent'];
    const parser = new UAParser(uaString);
    const uaInfo = parser.getResult();

    const deviceInfo: DeviceInfo = {
      browser: uaInfo.browser.name || 'Unknown',
      os: uaInfo.os.name || 'Unknown',
      type: uaInfo.device.type || 'desktop',
    };

    return this.testsService.participateTest(userId, publicId, deviceInfo);
  }

  @Get('/:id/result')
  @UseGuards(JwtAuthGuard)
  async getTestResultSummary(@UserId() userId: number, @Param('id') publicId: string) {
    return this.testsService.getTestResultSummary(userId, publicId);
  }

  @Get('/:id/result/participants')
  @UseGuards(JwtAuthGuard)
  async getTestParticipantsResults(@UserId() userId: number, @Param('id') publicId: string) {
    return this.testsService.getTestParticipantsResults(userId, publicId);
  }

  @Get('/:id/result/mainfeedback')
  @UseGuards(JwtAuthGuard)
  async getTestMainFeedback(@UserId() userId: number, @Param('id') publicId: string) {
    return this.testsService.getTestMainFeedback(userId, publicId);
  }

  @Get('/:id/result/participants/:participantId')
  @UseGuards(JwtAuthGuard)
  async getTestParticipantDetail(
    @UserId() userId: number,
    @Param('id') publicId: string,
    @Param('participantId') participantId: string,
  ) {
    return this.testsService.getTestParticipantDetail(userId, publicId, participantId);
  }

  @Post('/:id/members')
  @UseGuards(JwtAuthGuard)
  async addMember(
    @UserId() userId: number,
    @Param('id') publicId: string,
    @Param() addMemberDto: AddMemberDto,
  ) {
    return this.testsService.addMember(userId, publicId, addMemberDto.memberId);
  }

  @Delete('/:id/members/:memberId')
  @UseGuards(JwtAuthGuard)
  async removeMember(
    @UserId() userId: number,
    @Param('id') publicId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.testsService.removeMember(userId, publicId, memberId);
  }
}
