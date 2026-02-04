import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UAParser } from 'ua-parser-js';

import { CreateTestDto } from './dto/create-test.dto';
import { AddMemberDto } from './dto/member.dto';
import { SearchTestQueryDto } from './dto/search-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { TestsCommandService } from './services/tests-command.service';
import { TestsMemberService } from './services/tests-member.service';
import { TestsParticipantService } from './services/tests-participant.service';
import { TestsQueryService } from './services/tests-query.service';
import { TestsResultService } from './services/tests-result.service';
import { TestStatus } from './enums';

import { UserId } from '#domain/auth/decorator/param.decorator';
import { JwtAuthGuard } from '#domain/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '#domain/auth/guards/optional-jwt-auth.guard';

@Controller('tests')
export class TestsController {
  constructor(
    private readonly testsCommandService: TestsCommandService,
    private readonly testsQueryService: TestsQueryService,
    private readonly testsResultService: TestsResultService,
    private readonly testsParticipantService: TestsParticipantService,
    private readonly testsMemberService: TestsMemberService,
  ) {}

  // -- Test 조회 Endpoints --

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTests(@UserId() userId: number) {
    const tests = await this.testsQueryService.getMyTests(userId);
    return tests;
  }

  @Get('/search')
  async searchTests(@Query() query: SearchTestQueryDto) {
    return this.testsQueryService.searchTestsByQuery(query);
  }

  @Get('/:id')
  @UseGuards(OptionalJwtAuthGuard)
  async getTestById(@UserId() userId: number | undefined, @Param('id') publicId: string) {
    return this.testsQueryService.getTestById(userId, publicId);
  }

  @Get('/:id/sdkStatus')
  @UseGuards(JwtAuthGuard)
  async getSdkStatus(@UserId() userId: number, @Param('id') publicId: string) {
    return this.testsQueryService.getSdkStatus(userId, publicId);
  }

  // -- Test 관리 Endpoints --

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTest(@UserId() userId: number, @Body() body: CreateTestDto) {
    const testId = await this.testsCommandService.createTest(userId, body.title);
    return { testId };
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async updateTest(
    @UserId() userId: number,
    @Param('id') publicId: string,
    @Body() updateTestDto: UpdateTestDto,
  ) {
    return await this.testsCommandService.updateTest(userId, publicId, updateTestDto);
  }

  @Post('/:id/verify-sdk')
  @UseGuards(JwtAuthGuard)
  async verifySdk(@UserId() userId: number, @Param('id') publicId: string) {
    // SDK 검증 로직은 서비스 레이어에서 구현
    return this.testsCommandService.verifySdkInstallation(userId, publicId);
  }

  @Post('/:id/status')
  @UseGuards(JwtAuthGuard)
  async updateTestStatus(
    @UserId() userId: number,
    @Param('id') publicId: string,
    @Body('status', new ParseEnumPipe(TestStatus)) status: TestStatus,
  ) {
    return await this.testsCommandService.updateTestStatus(userId, publicId, status);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteTest(@UserId() userId: number, @Param('id') publicId: string) {
    return await this.testsCommandService.deleteTest(userId, publicId);
  }

  // -- Test 참여 Endpoints --

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

    return this.testsParticipantService.participateTest(userId, publicId, uaInfo);
  }

  // -- Test 결과 조회 Endpoints --

  @Get('/:id/result')
  @UseGuards(JwtAuthGuard)
  async getTestResultSummary(@UserId() userId: number, @Param('id') publicId: string) {
    return this.testsResultService.getTestResultSummary(userId, publicId);
  }

  @Get('/:id/result/participants')
  @UseGuards(JwtAuthGuard)
  async getTestParticipantsResults(@UserId() userId: number, @Param('id') publicId: string) {
    return this.testsResultService.getTestParticipantsResults(userId, publicId);
  }

  @Get('/:id/result/missions')
  @UseGuards(JwtAuthGuard)
  async getTestMissionsResults(@UserId() userId: number, @Param('id') publicId: string) {
    return this.testsResultService.getTestMissionsResults(userId, publicId);
  }

  @Get('/:id/result/mainfeedback')
  @UseGuards(JwtAuthGuard)
  async getTestMainFeedback(@UserId() userId: number, @Param('id') publicId: string) {
    return this.testsResultService.getTestMainFeedback(userId, publicId);
  }

  @Get('/:id/result/participants/:participantId')
  @UseGuards(JwtAuthGuard)
  async getTestParticipantDetail(
    @UserId() userId: number,
    @Param('id') publicId: string,
    @Param('participantId') participantId: string,
  ) {
    return this.testsResultService.getTestParticipantDetail(userId, publicId, participantId);
  }

  // -- Test Member 관리 Endpoints --

  @Post('/:id/members')
  @UseGuards(JwtAuthGuard)
  async addMember(
    @UserId() userId: number,
    @Param('id') publicId: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.testsMemberService.addMember(userId, publicId, addMemberDto.memberId);
  }

  @Delete('/:id/members/:memberId')
  @UseGuards(JwtAuthGuard)
  async removeMember(
    @UserId() userId: number,
    @Param('id') publicId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.testsMemberService.removeMember(userId, publicId, memberId);
  }
}
