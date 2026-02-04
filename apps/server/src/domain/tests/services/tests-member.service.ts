import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { TestsRepository } from '../tests.repository';

import { User } from '#domain/users/entities/user.entity';
import { UsersService } from '#domain/users/users.service';

@Injectable()
export class TestsMemberService {
  constructor(
    private readonly testsRepository: TestsRepository,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 테스트 멤버를 추가합니다.
   *
   * @param userId 사용자 ID
   * @param publicId 테스트 공개 ID
   * @param memberPublicId 추가할 멤버 공개 ID
   * @throws NotFoundException 테스트 또는 멤버를 찾을 수 없는 경우
   * @throws ForbiddenException 소유자가 아닌 사용자가 접근하는 경우
   * @throws BadRequestException 이미 멤버인 사용자를 추가하려는 경우
   */
  async addMember(userId: number, publicId: string, memberPublicId: string) {
    const test = await this.testsRepository.findByPublicIdWithMembers(publicId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    if (test.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to add members to this test');
    }

    const findMemberId = await this.usersService.getIdByPublicId(memberPublicId);
    if (!findMemberId) {
      throw new NotFoundException('User not found');
    }
    if (test.members.some((member) => member.id === findMemberId)) {
      throw new BadRequestException('User is already a member of this test');
    }

    test.members.push({ id: findMemberId } as User);
    await this.testsRepository.save(test);
  }

  /**
   * 테스트 멤버를 제거합니다.
   *
   * @param userId 사용자 ID
   * @param publicId 테스트 공개 ID
   * @param memberId 제거할 멤버 공개 ID
   * @throws NotFoundException 테스트 또는 멤버를 찾을 수 없는 경우
   * @throws ForbiddenException 소유자가 아닌 사용자가 접근하는 경우
   */
  async removeMember(userId: number, publicId: string, memberId: string) {
    const test = await this.testsRepository.findByPublicIdWithMembers(publicId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    if (test.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to remove members from this test');
    }

    const memberIndex = test.members.findIndex((member) => member.publicId === memberId);
    if (memberIndex === -1) {
      throw new NotFoundException('Member not found in this test');
    }

    test.members.splice(memberIndex, 1);
    await this.testsRepository.save(test);
  }

  /**
   * 사용자 등록 이벤트(데모 테스트 멤버 추가)를 처리합니다.
   *
   * @param user 등록된 사용자
   */
  @OnEvent('user.registered')
  async handleUserRegisteredEvent(user: User) {
    // 데모 테스트에 가입한 사용자 추가
    const demoTest = await this.testsRepository.findDemoTest();
    if (!demoTest) {
      return;
    }
    await this.testsRepository.addMemberToTests(demoTest.id, user.id);
  }
}
