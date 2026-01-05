import { Controller, Delete, Get, Patch } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor() {}

  @Get('/me')
  getProfile() {
    throw new Error('Method not implemented.');
  }

  @Delete('/me')
  deleteProfile() {
    throw new Error('Method not implemented.');
  }

  @Patch()
  updateProfile() {
    throw new Error('Method not implemented.');
  }
}
