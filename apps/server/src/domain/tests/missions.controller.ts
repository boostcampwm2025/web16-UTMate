import { Controller, Inject } from '@nestjs/common';

import { MissionsService } from './missions.service';

@Controller('missions')
export class MissionsController {
  constructor(@Inject() private readonly missionsService: MissionsService) {}
}
