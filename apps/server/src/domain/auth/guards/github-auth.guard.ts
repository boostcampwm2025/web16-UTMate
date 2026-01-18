import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GITHUB } from '../const';

@Injectable()
export class GithubAuthGuard extends AuthGuard(GITHUB) {}
